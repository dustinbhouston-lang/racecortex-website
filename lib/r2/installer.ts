/**
 * resolveInstaller() — decides which installer object the website serves.
 *
 * Reads latest.yml (the update feed's manifest) from the installer bucket,
 * validates it with parseLatestYml(), then HEADs the named object. Returns the
 * key + version, or a typed `unavailable` result. Never throws, never falls
 * back to a hardcoded or older key — missing beats wrong.
 *
 * Every network wait is bounded: GetObject (including the body read) ≤ 5 s,
 * HEAD ≤ 3 s, the whole resolve ≤ 8 s, with at most one retry inside that
 * budget. Each step's deadline is also capped by the remaining total budget.
 *
 * R2 access is injected (R2InstallerStore) so this module holds no credentials
 * and can be exercised with a fake. The server-only wiring to the real R2
 * client lives in lib/r2/client.ts → resolveLatestInstaller().
 */

import { parseLatestYml, type LatestYmlRejection } from './latest-yml'

export const LATEST_YML_KEY = 'latest.yml'

export interface R2InstallerStore {
  getObject(
    key: string,
    signal: AbortSignal,
  ): Promise<{ Body?: { transformToString(): Promise<string>; destroy?: () => void } }>
  headObject(key: string, signal: AbortSignal): Promise<unknown>
}

export type UnavailableReason =
  | 'r2_config'
  | 'feed_read_timeout'
  | 'feed_read_error'
  | 'feed_empty_body'
  | `feed_invalid_${LatestYmlRejection}`
  | 'head_timeout'
  | 'head_not_found'
  | 'head_error'
  | 'budget_exhausted'

export type InstallerResolution =
  | { status: 'available'; key: string; version: string }
  | { status: 'unavailable'; reason: UnavailableReason }

export interface ResolveOptions {
  getObjectTimeoutMs?: number
  headTimeoutMs?: number
  totalTimeoutMs?: number
}

export const DEFAULT_RESOLVE_OPTIONS = {
  getObjectTimeoutMs: 5_000,
  headTimeoutMs: 3_000,
  totalTimeoutMs: 8_000,
} as const

class DeadlineError extends Error {
  constructor() {
    super('deadline exceeded')
    this.name = 'DeadlineError'
  }
}

/** Run fn with an AbortSignal; reject with DeadlineError once ms elapses, even if fn ignores the signal. */
async function withDeadline<T>(ms: number, fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort()
      reject(new DeadlineError())
    }, ms)
  })
  try {
    return await Promise.race([fn(controller.signal), timeout])
  } finally {
    clearTimeout(timer)
  }
}

function isNotFound(err: unknown): boolean {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } } | null
  return e?.name === 'NotFound' || e?.name === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404
}

type Attempt = InstallerResolution & { retryable?: boolean }

async function attemptResolve(
  store: R2InstallerStore,
  opts: Required<ResolveOptions>,
  deadlineAt: number,
): Promise<Attempt> {
  // ── 1. Read latest.yml (send + full body read under one deadline) ────────
  const getBudget = Math.min(opts.getObjectTimeoutMs, deadlineAt - Date.now())
  if (getBudget <= 0) return { status: 'unavailable', reason: 'budget_exhausted' }

  let text: string
  try {
    text = await withDeadline(getBudget, async (signal) => {
      const res = await store.getObject(LATEST_YML_KEY, signal)
      if (!res.Body) throw Object.assign(new Error('empty body'), { name: 'EmptyBody' })
      const body = res.Body
      signal.addEventListener('abort', () => body.destroy?.(), { once: true })
      return body.transformToString()
    })
  } catch (err) {
    if (err instanceof DeadlineError) {
      return { status: 'unavailable', reason: 'feed_read_timeout', retryable: true }
    }
    if ((err as Error)?.name === 'EmptyBody') return { status: 'unavailable', reason: 'feed_empty_body' }
    return { status: 'unavailable', reason: 'feed_read_error', retryable: !isNotFound(err) }
  }

  // ── 2. Validate ──────────────────────────────────────────────────────────
  const parsed = parseLatestYml(text)
  if (!parsed.ok) return { status: 'unavailable', reason: `feed_invalid_${parsed.reason}` }

  // ── 3. HEAD the named installer ──────────────────────────────────────────
  const headBudget = Math.min(opts.headTimeoutMs, deadlineAt - Date.now())
  if (headBudget <= 0) return { status: 'unavailable', reason: 'budget_exhausted' }

  try {
    await withDeadline(headBudget, (signal) => store.headObject(parsed.key, signal))
  } catch (err) {
    if (err instanceof DeadlineError) {
      return { status: 'unavailable', reason: 'head_timeout', retryable: true }
    }
    if (isNotFound(err)) return { status: 'unavailable', reason: 'head_not_found' }
    return { status: 'unavailable', reason: 'head_error', retryable: true }
  }

  return { status: 'available', key: parsed.key, version: parsed.version }
}

export async function resolveInstaller(
  getStore: () => R2InstallerStore,
  options: ResolveOptions = {},
): Promise<InstallerResolution> {
  const opts = { ...DEFAULT_RESOLVE_OPTIONS, ...options }
  const deadlineAt = Date.now() + opts.totalTimeoutMs

  let store: R2InstallerStore
  try {
    store = getStore()
  } catch {
    // Missing env vars etc. Do not log the error message (it may name config).
    console.error('[installer] unavailable reason=r2_config')
    return { status: 'unavailable', reason: 'r2_config' }
  }

  let result = await attemptResolve(store, opts, deadlineAt)
  if (result.status === 'unavailable' && result.retryable && deadlineAt - Date.now() > 0) {
    console.warn(`[installer] retrying after reason=${result.reason}`)
    result = await attemptResolve(store, opts, deadlineAt)
  }

  if (result.status === 'unavailable') {
    // Reason code only — never credentials, tokens or URLs.
    console.error(`[installer] unavailable reason=${result.reason}`)
    return { status: 'unavailable', reason: result.reason }
  }
  return { status: 'available', key: result.key, version: result.version }
}

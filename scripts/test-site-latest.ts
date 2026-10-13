/**
 * SITE-LATEST-1 checks — latest.yml parser, installer resolver (fake R2) and
 * the /api/download handler (fake auth/profile/presign). No network, no env.
 *
 *   pnpm exec tsx scripts/test-site-latest.ts
 *
 * Exits non-zero on any failure.
 */
import { parseLatestYml } from "../lib/r2/latest-yml"
import { resolveInstaller, type R2InstallerStore, type InstallerResolution } from "../lib/r2/installer"
import { handleDownloadRequest, PRESIGN_EXPIRY_SECONDS, type DownloadDeps } from "../lib/download/handler"
import { DOWNLOAD_UNAVAILABLE_MESSAGE } from "../lib/download/messages"

let failures = 0
let checks = 0
function check(name: string, ok: boolean, detail = "") {
  checks++
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}

// Silence the module's own reason-code logging so the output stays readable.
const realError = console.error
const realWarn = console.warn
const logged: string[] = []
console.error = (...a: unknown[]) => void logged.push(a.join(" "))
console.warn = (...a: unknown[]) => void logged.push(a.join(" "))
const realLog = console.log
const quietLog = (...a: unknown[]) => {
  const line = a.join(" ")
  if (line.startsWith("[download]")) logged.push(line)
  else realLog(...a)
}
console.log = quietLog

// ── 1. Parser ───────────────────────────────────────────────────────────────
console.log("\n== parseLatestYml ==")

const REAL_FEED = `version: 1.8.0
files:
  - url: RaceCortex Setup 1.8.0.exe
    sha512: abc==
    size: 273808936
path: RaceCortex Setup 1.8.0.exe
sha512: abc==
releaseDate: '2026-10-12T20:45:42.822Z'
`
// Verbatim dist/installer/latest.yml from the 1.8.1 desktop build.
const REAL_181 = `version: 1.8.1
files:
  - url: RaceCortex Setup 1.8.1.exe
    sha512: lVuQOXZrnN2s32qbzhx2C5VS9dYSO7JYulkShuud0rrREIw07jkFEkdrWqbIPw1S5QcgiQZU6Dqr28S5R/PxYQ==
    size: 273808936
path: RaceCortex Setup 1.8.1.exe
sha512: lVuQOXZrnN2s32qbzhx2C5VS9dYSO7JYulkShuud0rrREIw07jkFEkdrWqbIPw1S5QcgiQZU6Dqr28S5R/PxYQ==
releaseDate: '2026-10-12T20:45:42.822Z'
`
const PAIR = "version: 1.8.0\npath: RaceCortex Setup 1.8.0.exe"

// SITE-LATEST-1-fix regressions: feeds the desktop updater's YAML parser would
// reject or read differently. Each must be rejected by the parser AND produce a
// 503 at the route with zero HEAD / presign calls.
const regressions: Array<[string, string, string]> = [
  ["Codex #1: quoted duplicate key \"version\"", `version: 1.8.0\n"version": 1.8.1\npath: RaceCortex Setup 1.8.0.exe\n`, "unsupported_line"],
  ["Codex #2: escaped duplicate \"ver\\u0073ion\"", `${PAIR}\n"ver\\u0073ion": 1.8.1\n`, "unsupported_line"],
  ["Codex #3: second YAML document (---)", "version: 1.8.0\n---\npath: RaceCortex Setup 1.8.0.exe\n", "unsupported_line"],
  ["Codex #4: complete feed + dangling files: [", `${PAIR}\nsha512: abc==\nreleaseDate: '2026-10-12T20:45:42.822Z'\nfiles: [\n`, "unsupported_line"],
  ["escaped duplicate \"p\\u0061th\"", `${PAIR}\n"p\\u0061th": RaceCortex Setup 1.8.0.exe\n`, "unsupported_line"],
  ["explicit key (? version)", `${PAIR}\n? version\n: 1.8.1\n`, "unsupported_line"],
  ["anchor (version: &v 1.8.1)", `version: &v 1.8.1\npath: RaceCortex Setup 1.8.1.exe\n`, "invalid_version"],
  ["alias (version: *v)", `${PAIR}\nversion: *v\n`, "invalid_version"],
  ["flow mapping ({version: 1.8.1})", `${PAIR}\n{version: 1.8.1}\n`, "unsupported_line"],
  ["# comment line", `# built by CI\n${PAIR}\n`, "unsupported_line"],
  ["files url disagrees with path", REAL_181.replace("  - url: RaceCortex Setup 1.8.1.exe", "  - url: RaceCortex Setup 1.7.0.exe"), "url_path_mismatch"],
  ["unknown top-level key", `${PAIR}\nchannel: beta\n`, "unsupported_line"],
  ["tab-indented files line", `version: 1.8.0\nfiles:\n\t- url: RaceCortex Setup 1.8.0.exe\npath: RaceCortex Setup 1.8.0.exe\n`, "files_block_invalid"],
  ["sha512 before - url:", "version: 1.8.1\nfiles:\n    sha512: abc==\n  - url: RaceCortex Setup 1.8.1.exe\n    size: 273808936\npath: RaceCortex Setup 1.8.1.exe\n", "files_block_invalid"],
  ["size before - url:", "version: 1.8.1\nfiles:\n    size: 273808936\n  - url: RaceCortex Setup 1.8.1.exe\npath: RaceCortex Setup 1.8.1.exe\n", "files_block_invalid"],
  ["files: block with only fields, no - url:", "version: 1.8.1\nfiles:\n    sha512: abc==\n    size: 273808936\npath: RaceCortex Setup 1.8.1.exe\n", "files_block_invalid"],
  ["files: with nothing under it", "version: 1.8.1\nfiles:\npath: RaceCortex Setup 1.8.1.exe\n", "files_block_invalid"],
  ["second - url: item", REAL_181.replace("    size: 273808936\n", "    size: 273808936\n  - url: RaceCortex Setup 1.8.1.exe\n"), "files_block_invalid"],
  ["duplicate item field (size twice)", REAL_181.replace("    size: 273808936\n", "    size: 273808936\n    size: 1\n"), "files_block_invalid"],
  ["orphan item field outside any files: block", `${PAIR}\n    size: 1\n`, "unsupported_line"],
  ["empty line mid-file", "version: 1.8.0\n\npath: RaceCortex Setup 1.8.0.exe\n", "unsupported_line"],
  ["duplicate releaseDate", `${PAIR}\nreleaseDate: '2026-10-12T20:45:42.822Z'\nreleaseDate: '2026-10-13T00:00:00.000Z'\n`, "duplicate_key"],
]

{
  const r = parseLatestYml(REAL_FEED)
  check(
    "accept 1.8.0 (electron-builder shape)",
    r.ok && r.key === "RaceCortex Setup 1.8.0.exe" && r.version === "1.8.0",
    JSON.stringify(r),
  )
  const crlf = parseLatestYml(REAL_FEED.replace(/\n/g, "\r\n"))
  check("accept CRLF line endings", crlf.ok && crlf.key === "RaceCortex Setup 1.8.0.exe", JSON.stringify(crlf))
  const real = parseLatestYml(REAL_181)
  check("accept exact real 1.8.1 generator output", real.ok && real.key === "RaceCortex Setup 1.8.1.exe" && real.version === "1.8.1", JSON.stringify(real))
  const realCrlf = parseLatestYml(REAL_181.replace(/\n/g, "\r\n"))
  check("accept real 1.8.1 with CRLF", realCrlf.ok && realCrlf.version === "1.8.1", JSON.stringify(realCrlf))
  const withBlockMap = parseLatestYml(REAL_181.replace("    size: 273808936\n", "    size: 273808936\n    blockMapSize: 291234\n"))
  check("accept real 1.8.1 with blockMapSize", withBlockMap.ok && withBlockMap.version === "1.8.1", JSON.stringify(withBlockMap))
  const noTrailingNewline = parseLatestYml(REAL_181.trimEnd())
  check("accept real 1.8.1 without trailing newline", noTrailingNewline.ok, JSON.stringify(noTrailingNewline))
}

const rejects: Array<[string, string, string]> = [
  ["version/path mismatch (1.8.1 vs 1.8.0.exe)", "version: 1.8.1\npath: RaceCortex Setup 1.8.0.exe\n", "version_path_mismatch"],
  ["missing version", "path: RaceCortex Setup 1.8.0.exe\n", "missing_version"],
  ["missing path", "version: 1.8.0\n", "missing_path"],
  ["invalid version 1.8", "version: 1.8\npath: RaceCortex Setup 1.8.exe\n", "invalid_version"],
  ["invalid version v1.8.0", "version: v1.8.0\npath: RaceCortex Setup 1.8.0.exe\n", "invalid_version"],
  ["duplicate version:", "version: 1.8.0\nversion: 1.8.0\npath: RaceCortex Setup 1.8.0.exe\n", "duplicate_version"],
  ["duplicate path:", "version: 1.8.0\npath: RaceCortex Setup 1.8.0.exe\npath: RaceCortex Setup 1.8.0.exe\n", "duplicate_path"],
  ["path containing ../", "version: 1.8.0\npath: ../RaceCortex Setup 1.8.0.exe\n", "invalid_path"],
  ["non-matching name", "version: 1.8.0\npath: PitWall Setup 1.8.0.exe\n", "invalid_path"],
  ["empty text", "", "empty"],
  ["whitespace-only text", "  \n\n", "empty"],
  // SITE-LATEST-1-fix (rule 5): was missing_version — an indented non-url line under files: is now a files-block error.
  ["indented-only version (under files:)", "files:\n  version: 1.8.0\npath: RaceCortex Setup 1.8.0.exe\n", "files_block_invalid"],
  // SITE-LATEST-1-fix (rule 5): was unsupported_scalar — any non-N.N.N version value is invalid_version.
  ["block/flow scalar", "version: [1.8.0]\npath: RaceCortex Setup 1.8.0.exe\n", "invalid_version"],
  // SITE-LATEST-1-fix (rule 5): was an ACCEPT case — the generator never quotes version/path.
  ["simply-quoted values", `version: '1.8.0'\npath: "RaceCortex Setup 1.8.0.exe"\n`, "invalid_version"],
  ...regressions,
]
for (const [name, text, reason] of rejects) {
  const r = parseLatestYml(text)
  check(`reject ${name}`, !r.ok && r.reason === reason, JSON.stringify(r))
}

// ── 2. Resolver + handler with fake R2 ─────────────────────────────────────
console.log("\n== resolver + /api/download handler (fake R2) ==")

const FAST = { getObjectTimeoutMs: 60, headTimeoutMs: 40, totalTimeoutMs: 150 }
const never = <T>() => new Promise<T>(() => {})
const notFound = () => Object.assign(new Error("NotFound"), { name: "NotFound", $metadata: { httpStatusCode: 404 } })

interface FakeSpec {
  get?: () => Promise<{ Body?: { transformToString(): Promise<string> } }>
  head?: () => Promise<unknown>
}
function fakeStore(spec: FakeSpec) {
  const calls = { get: 0, head: 0, headKeys: [] as string[] }
  const okBody = { Body: { transformToString: async () => REAL_FEED } }
  const store: R2InstallerStore = {
    getObject: (key) => {
      calls.get++
      if (key !== "latest.yml") throw new Error(`unexpected GetObject key ${key}`)
      return spec.get ? spec.get() : Promise.resolve(okBody)
    },
    headObject: (key) => {
      calls.head++
      calls.headKeys.push(key)
      return spec.head ? spec.head() : Promise.resolve({})
    },
  }
  return { store, calls }
}

function makeDeps(over: Partial<DownloadDeps> & { resolveInstaller: () => Promise<InstallerResolution> }) {
  const spy = { presign: [] as Array<[string, number]>, resolve: 0 }
  const deps: DownloadDeps = {
    getUser: async () => ({ id: "user-1" }),
    getBetaActive: async () => ({ betaActive: true }),
    presign: async (key, expiresIn) => {
      spy.presign.push([key, expiresIn])
      return { url: "https://fake-r2.invalid/signed", bucket: "fake-bucket" }
    },
    ...over,
    resolveInstaller: async () => {
      spy.resolve++
      return over.resolveInstaller()
    },
  }
  return { deps, spy }
}

const REQ = "https://www.racecortex.com/api/download"
const NO_STORE = "private, no-cache, no-store, must-revalidate"

const failureCases: Array<[string, FakeSpec, string]> = [
  ["GetObject error", { get: () => Promise.reject(new Error("socket hang up")) }, "feed_read_error"],
  ["body-read error", { get: async () => ({ Body: { transformToString: () => Promise.reject(new Error("ECONNRESET")) } }) }, "feed_read_error"],
  ["body stall past deadline", { get: async () => ({ Body: { transformToString: () => never<string>() } }) }, "feed_read_timeout"],
  ["GetObject send stall", { get: () => never() }, "feed_read_timeout"],
  ["latest.yml missing (404)", { get: () => Promise.reject(notFound()) }, "feed_read_error"],
  ["invalid latest.yml", { get: async () => ({ Body: { transformToString: async () => "version: 1.8.1\npath: RaceCortex Setup 1.8.0.exe\n" } }) }, "feed_invalid_version_path_mismatch"],
  ["HEAD 404", { head: () => Promise.reject(notFound()) }, "head_not_found"],
  ["HEAD stall", { head: () => never() }, "head_timeout"],
  ["HEAD error", { head: () => Promise.reject(new Error("500")) }, "head_error"],
]

async function main() {
  for (const [name, spec, reason] of failureCases) {
    logged.length = 0
    const { store, calls } = fakeStore(spec)
    const started = Date.now()
    const { deps, spy } = makeDeps({ resolveInstaller: () => resolveInstaller(() => store, FAST) })
    const res = await handleDownloadRequest(REQ, deps)
    const elapsed = Date.now() - started
    const body = await res.text()
    check(
      `${name} → unavailable(${reason}), 503 HTML, no redirect, no presign`,
      res.status === 503 &&
        res.headers.get("location") === null &&
        (res.headers.get("content-type") ?? "").startsWith("text/html") &&
        res.headers.get("cache-control") === NO_STORE &&
        body.includes(DOWNLOAD_UNAVAILABLE_MESSAGE) &&
        spy.presign.length === 0 &&
        logged.some((l) => l.includes(`reason=${reason}`)) &&
        elapsed <= FAST.totalTimeoutMs + 50,
      `status=${res.status} get=${calls.get} head=${calls.head} elapsed=${elapsed}ms`,
    )
  }

  // SITE-LATEST-1-fix: every rejected feed → 503 at the route, zero HEAD, zero presign, no retry.
  for (const [name, text, reason] of regressions) {
    logged.length = 0
    const { store, calls } = fakeStore({ get: async () => ({ Body: { transformToString: async () => text } }) })
    const { deps, spy } = makeDeps({ resolveInstaller: () => resolveInstaller(() => store, FAST) })
    const res = await handleDownloadRequest(REQ, deps)
    const body = await res.text()
    check(
      `route: ${name} → 503 feed_invalid_${reason}, no HEAD, no presign`,
      res.status === 503 &&
        res.headers.get("location") === null &&
        body.includes(DOWNLOAD_UNAVAILABLE_MESSAGE) &&
        calls.get === 1 &&
        calls.head === 0 &&
        spy.presign.length === 0 &&
        logged.some((l) => l.includes(`reason=feed_invalid_${reason}`)),
      `status=${res.status} get=${calls.get} head=${calls.head} presign=${spy.presign.length}`,
    )
  }

  // Happy path with the exact real 1.8.1 feed.
  {
    const { store, calls } = fakeStore({ get: async () => ({ Body: { transformToString: async () => REAL_181.replace(/\n/g, "\r\n") } }) })
    const { deps, spy } = makeDeps({ resolveInstaller: () => resolveInstaller(() => store, FAST) })
    const res = await handleDownloadRequest(REQ, deps)
    check(
      "route: real 1.8.1 feed (CRLF) → HEAD + presign RaceCortex Setup 1.8.1.exe for 900 s",
      res.status === 302 && calls.headKeys[0] === "RaceCortex Setup 1.8.1.exe" && spy.presign[0]?.[0] === "RaceCortex Setup 1.8.1.exe" && spy.presign[0]?.[1] === 900,
      `presign=${JSON.stringify(spy.presign)}`,
    )
  }

  // Resolver-level: the result itself is typed `unavailable` with the reason.
  {
    const { store } = fakeStore({ head: () => Promise.reject(notFound()) })
    const r = await resolveInstaller(() => store, FAST)
    check("resolver returns typed unavailable result", r.status === "unavailable" && r.reason === "head_not_found", JSON.stringify(r))
  }

  // Retry budget: one retry for a transient error, none for a definitive one.
  {
    const transient = fakeStore({ get: () => Promise.reject(new Error("socket hang up")) })
    await resolveInstaller(() => transient.store, FAST)
    check("transient GetObject error retried exactly once", transient.calls.get === 2, `get calls=${transient.calls.get}`)
    const definitive = fakeStore({ head: () => Promise.reject(notFound()) })
    await resolveInstaller(() => definitive.store, FAST)
    check("HEAD 404 not retried", definitive.calls.get === 1 && definitive.calls.head === 1, `get=${definitive.calls.get} head=${definitive.calls.head}`)
  }

  // Missing R2 config → unavailable, never a throw.
  {
    const r = await resolveInstaller(() => {
      throw new Error("Missing required env var: R2_ACCOUNT_ID")
    }, FAST)
    check("R2 config error → unavailable(r2_config), no throw", r.status === "unavailable" && r.reason === "r2_config", JSON.stringify(r))
  }

  // Default (production) deadlines: a stalled body is cut off within the 8 s total budget.
  {
    const { store, calls } = fakeStore({ get: async () => ({ Body: { transformToString: () => never<string>() } }) })
    const started = Date.now()
    const r = await resolveInstaller(() => store)
    const elapsed = Date.now() - started
    check(
      "default deadlines: body stall → unavailable within 8 s (5 s + retry capped by budget)",
      r.status === "unavailable" && r.reason === "feed_read_timeout" && elapsed >= 7_900 && elapsed <= 8_300 && calls.get === 2,
      `elapsed=${elapsed}ms get calls=${calls.get}`,
    )
  }

  // Happy path → presign with resolved key and 900 s.
  {
    const { store, calls } = fakeStore({})
    const { deps, spy } = makeDeps({ resolveInstaller: () => resolveInstaller(() => store, FAST) })
    const res = await handleDownloadRequest(REQ, deps)
    check(
      "happy path → HEAD + presign resolved key with 900 s, 302 no-store",
      res.status === 302 &&
        res.headers.get("location") === "https://fake-r2.invalid/signed" &&
        res.headers.get("cache-control") === NO_STORE &&
        calls.headKeys[0] === "RaceCortex Setup 1.8.0.exe" &&
        spy.presign.length === 1 &&
        spy.presign[0][0] === "RaceCortex Setup 1.8.0.exe" &&
        spy.presign[0][1] === 900 &&
        PRESIGN_EXPIRY_SECONDS === 900,
      `presign=${JSON.stringify(spy.presign)}`,
    )
    check("success log carries key, never the presigned URL", logged.some((l) => l.includes('key="RaceCortex Setup 1.8.0.exe"')) && !logged.some((l) => l.includes("fake-r2.invalid")))
  }

  // Auth gating unchanged.
  {
    const { deps, spy } = makeDeps({ getUser: async () => null, resolveInstaller: async () => ({ status: "available", key: "x", version: "1.0.0" }) })
    const res = await handleDownloadRequest(REQ, deps)
    check(
      "unauthenticated → 302 /download?error=session_expired, no resolve/presign",
      res.status === 302 &&
        res.headers.get("location") === "https://www.racecortex.com/download?error=session_expired" &&
        res.headers.get("cache-control") === NO_STORE &&
        spy.resolve === 0 &&
        spy.presign.length === 0,
      `location=${res.headers.get("location")}`,
    )
  }
  for (const [label, beta] of [
    ["beta_active=false", { betaActive: false }],
    ["profile error", { betaActive: false, errorMessage: "no rows" }],
  ] as const) {
    const { deps, spy } = makeDeps({ getBetaActive: async () => beta, resolveInstaller: async () => ({ status: "available", key: "x", version: "1.0.0" }) })
    const res = await handleDownloadRequest(REQ, deps)
    check(
      `beta-inactive (${label}) → 302 /download?error=beta_not_active, no resolve/presign`,
      res.status === 302 &&
        res.headers.get("location") === "https://www.racecortex.com/download?error=beta_not_active" &&
        res.headers.get("cache-control") === NO_STORE &&
        spy.resolve === 0 &&
        spy.presign.length === 0,
      `location=${res.headers.get("location")}`,
    )
  }

  // Presign failure after a good resolve → server_error redirect, as before.
  {
    const { store } = fakeStore({})
    const { deps } = makeDeps({
      resolveInstaller: () => resolveInstaller(() => store, FAST),
      presign: async () => {
        throw new Error("sdk boom")
      },
    })
    const res = await handleDownloadRequest(REQ, deps)
    check(
      "presign failure → 302 /download?error=server_error",
      res.status === 302 && res.headers.get("location") === "https://www.racecortex.com/download?error=server_error",
    )
  }

  // Page build-info path: the page awaits resolveLatestInstaller() and branches on
  // `status`. Every failure mode must resolve (not reject) to `unavailable`.
  {
    let threw = false
    const results: InstallerResolution[] = []
    try {
      for (const [, spec] of failureCases) {
        const { store } = fakeStore(spec)
        results.push(await resolveInstaller(() => store, FAST))
      }
      const syncThrow: R2InstallerStore = {
        getObject: () => {
          throw new Error("sync throw")
        },
        headObject: async () => ({}),
      }
      results.push(await resolveInstaller(() => syncThrow, FAST))
    } catch {
      threw = true
    }
    const labels = results.map((r) => (r.status === "available" ? `RaceCortex v${r.version}` : "RaceCortex"))
    check(
      "page build-info path: all failure modes → unavailable without throwing",
      !threw && results.every((r) => r.status === "unavailable") && labels.every((l) => l === "RaceCortex"),
      `${results.length} cases`,
    )
  }

  console.log = realLog
  console.error = realError
  console.warn = realWarn
  console.log(`\n${checks} checks: ${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error = realError
  console.error(err)
  process.exit(1)
})

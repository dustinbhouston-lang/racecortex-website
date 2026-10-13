/**
 * handleDownloadRequest() — the /api/download GET logic, with its I/O injected
 * so the auth gating and unavailable paths can be exercised with fakes.
 * app/api/download/route.ts wires the real Supabase + R2 dependencies.
 *
 * Flow:
 *   1. No session            → 302 /download?error=session_expired
 *   2. beta_active not true  → 302 /download?error=beta_not_active
 *   3. Resolve the installer from the update feed's latest.yml (every request;
 *      nothing from the client is trusted). Unavailable → 503 HTML page, no
 *      redirect, no presign, no fallback key.
 *   4. Presign the resolved key for 900 s → 302 to the presigned URL.
 *      Presign failure → 302 /download?error=server_error.
 *
 * Every response carries private/no-store headers so CDNs never cache it.
 */

import { NextResponse } from 'next/server'
import type { InstallerResolution } from '@/lib/r2/installer'
import { DOWNLOAD_UNAVAILABLE_MESSAGE } from './messages'

export const PRESIGN_EXPIRY_SECONDS = 900

export interface DownloadDeps {
  getUser(): Promise<{ id: string } | null>
  getBetaActive(userId: string): Promise<{ betaActive: boolean; errorMessage?: string }>
  resolveInstaller(): Promise<InstallerResolution>
  presign(key: string, expiresIn: number): Promise<{ url: string; bucket: string }>
}

/** Attach security headers to any response so CDNs never cache auth redirects. */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}

/** Build a redirect response with security headers applied. */
function secureRedirect(url: URL | string, status: 302 = 302): NextResponse {
  return applySecurityHeaders(NextResponse.redirect(url, status))
}

/**
 * The browser reached /api/download by full navigation (plain <a>), so the
 * unavailable state must be a readable page, not JSON.
 */
function unavailableResponse(): NextResponse {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Download unavailable — RaceCortex</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
         background: #0C0C0E; color: #F4F4F2; font-family: Inter, system-ui, sans-serif; padding: 24px; }
  main { max-width: 28rem; text-align: center; }
  p { color: #8A8C92; line-height: 1.6; }
  a { color: #FF4D00; }
</style>
</head>
<body>
<main>
  <h1>${DOWNLOAD_UNAVAILABLE_MESSAGE}</h1>
  <p><a href="/download">Back to the download page</a></p>
</main>
</body>
</html>`
  const response = new NextResponse(html, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '60' },
  })
  return applySecurityHeaders(response)
}

export async function handleDownloadRequest(requestUrl: string, deps: DownloadDeps): Promise<NextResponse> {
  const timestamp = new Date().toISOString()

  // ── Step 1: Verify auth session ──────────────────────────────────────────
  const user = await deps.getUser()
  if (!user) {
    console.log(`[download] ${timestamp} — DENIED session_expired (no user from getUser)`)
    return secureRedirect(new URL('/download?error=session_expired', requestUrl))
  }

  // ── Step 2: Check beta_active ────────────────────────────────────────────
  const { betaActive, errorMessage } = await deps.getBetaActive(user.id)
  if (!betaActive) {
    console.log(
      `[download] ${timestamp} — DENIED beta_not_active userId=${user.id} ` +
        (errorMessage ? `profileError=${errorMessage}` : 'beta_active=false'),
    )
    return secureRedirect(new URL('/download?error=beta_not_active', requestUrl))
  }

  // ── Step 3: Resolve the installer the update feed serves ─────────────────
  const installer = await deps.resolveInstaller()
  if (installer.status === 'unavailable') {
    console.error(`[download] ${timestamp} — UNAVAILABLE userId=${user.id} reason=${installer.reason}`)
    return unavailableResponse()
  }

  // ── Step 4: Presign and redirect ─────────────────────────────────────────
  try {
    const { url, bucket } = await deps.presign(installer.key, PRESIGN_EXPIRY_SECONDS)

    // DO NOT log the presigned URL — it contains the signature (a secret credential).
    console.log(
      `[download] ${timestamp} — SUCCESS userId=${user.id} ` +
        `bucket=${bucket} key="${installer.key}"`,
    )

    return secureRedirect(url)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[download] ${timestamp} — ERROR generating presigned URL userId=${user.id}: ${message}`)

    // Redirect to a generic error state rather than showing a raw 500 to the browser.
    return secureRedirect(new URL('/download?error=server_error', requestUrl))
  }
}

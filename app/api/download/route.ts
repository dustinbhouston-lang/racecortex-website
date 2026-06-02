/**
 * /api/download — auth-gated installer download endpoint.
 *
 * GET request flow:
 *   1. Validate the user's session via the cookie-based Supabase client (getUser).
 *      If no session → redirect /download?error=session_expired (302).
 *   2. Check profiles.beta_active via the admin client (service role, bypasses RLS).
 *      If missing or false → redirect /download?error=beta_not_active (302).
 *   3. Generate a 15-minute presigned R2 URL for the installer object.
 *   4. Return 302 redirect to the presigned URL.
 *
 * All responses (success and error) are redirects — never raw JSON.
 * The user clicked a link, so the browser must receive a redirect, not JSON text.
 *
 * Security headers are set on every response to prevent CDN/proxy caching of
 * responses that contain session-linked presigned URLs.
 *
 * REV 7: TWO separate Supabase clients are used intentionally:
 *   - `supabase` (cookie-based, from server.ts) for auth.getUser() only.
 *     getUser() on the admin client would ignore cookies and always return null.
 *   - `admin` (service-role, from admin.ts) for the profiles query only.
 *     Using `supabase` for profiles would be subject to RLS; using admin bypasses it.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getR2Client, getInstallerBucketName, INSTALLER_OBJECT_KEY } from '@/lib/r2/client'

// The AWS SDK uses Node.js `crypto` and other Node-only APIs.
// Explicitly declare Node.js runtime to prevent accidental Edge deployment,
// which would silently fail at runtime.
export const runtime = 'nodejs'

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

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()

  // ── Step 1: Verify auth session ──────────────────────────────────────────
  // MUST use the cookie-based server client for getUser().
  // Calling getUser() on the admin client ignores cookies and always returns null.
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log(`[download] ${timestamp} — DENIED session_expired (no user from getUser)`)
    return secureRedirect(new URL('/download?error=session_expired', request.url))
  }

  // ── Step 2: Check beta_active via admin client ───────────────────────────
  // MUST use the admin (service-role) client so RLS is bypassed.
  // Using the cookie-based `supabase` client here would be subject to RLS
  // policies on the profiles table, which may block the query.
  const admin = getAdminClient()
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('beta_active')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.beta_active !== true) {
    console.log(
      `[download] ${timestamp} — DENIED beta_not_active userId=${user.id} ` +
        (profileError ? `profileError=${profileError.message}` : 'beta_active=false'),
    )
    return secureRedirect(new URL('/download?error=beta_not_active', request.url))
  }

  // ── Step 3 + 4: Generate presigned R2 URL and redirect ───────────────────
  try {
    const r2 = getR2Client()
    const bucket = getInstallerBucketName()

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: INSTALLER_OBJECT_KEY,
    })

    // Expiry: 900 seconds (15 minutes). The download must start within this window.
    const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 900 })

    // DO NOT log the presigned URL — it contains the signature (a secret credential).
    console.log(
      `[download] ${timestamp} — SUCCESS userId=${user.id} ` +
        `bucket=${bucket} key="${INSTALLER_OBJECT_KEY}"`,
    )

    return secureRedirect(presignedUrl)
  } catch (err) {
    // R2 client init errors (missing env vars) or SDK errors surface here.
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[download] ${timestamp} — ERROR generating presigned URL userId=${user.id}: ${message}`)

    // Redirect to a generic error state rather than showing a raw 500 to the browser.
    return secureRedirect(new URL('/download?error=server_error', request.url))
  }
}

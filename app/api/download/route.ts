/**
 * /api/download — auth-gated installer download endpoint.
 *
 * GET request flow:
 *   1. Validate the user's session via the cookie-based Supabase client (getUser).
 *      If no session → redirect /download?error=session_expired (302).
 *   2. Check profiles.beta_active via the admin client (service role, bypasses RLS).
 *      If missing or false → redirect /download?error=beta_not_active (302).
 *   3. Resolve the installer named by the update feed's latest.yml (re-resolved
 *      on every request — see lib/r2/client.ts resolveLatestInstaller()).
 *      Unavailable → 503 readable HTML page, no redirect, no fallback key.
 *   4. Generate a 15-minute presigned R2 URL for that object → 302 redirect.
 *
 * Never raw JSON: the user clicked a link, so the browser gets a redirect or,
 * when the installer cannot be resolved, a readable HTML page.
 * The logic lives in lib/download/handler.ts (dependency-injected for tests);
 * this file wires the real Supabase + R2 dependencies.
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

import { type NextRequest } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getR2Client, getInstallerBucketName, resolveLatestInstaller } from '@/lib/r2/client'
import { handleDownloadRequest } from '@/lib/download/handler'

// The AWS SDK uses Node.js `crypto` and other Node-only APIs.
// Explicitly declare Node.js runtime to prevent accidental Edge deployment,
// which would silently fail at runtime.
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return handleDownloadRequest(request.url, {
    // MUST use the cookie-based server client for getUser().
    // Calling getUser() on the admin client ignores cookies and always returns null.
    async getUser() {
      const supabase = await createServerClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    },

    // MUST use the admin (service-role) client so RLS is bypassed.
    // Using the cookie-based client here would be subject to RLS
    // policies on the profiles table, which may block the query.
    async getBetaActive(userId) {
      const admin = getAdminClient()
      const { data: profile, error: profileError } = await admin
        .from('profiles')
        .select('beta_active')
        .eq('id', userId)
        .single()
      return {
        betaActive: !profileError && profile?.beta_active === true,
        errorMessage: profileError?.message,
      }
    },

    resolveInstaller: resolveLatestInstaller,

    async presign(key, expiresIn) {
      const r2 = getR2Client()
      const bucket = getInstallerBucketName()
      const command = new GetObjectCommand({ Bucket: bucket, Key: key })
      return { url: await getSignedUrl(r2, command, { expiresIn }), bucket }
    },
  })
}

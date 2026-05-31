import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy (formerly middleware.ts — renamed in v16.0.0).
 *
 * Refreshes the Supabase session on every request so that the access token
 * in cookies stays current. Without this, Server Components that call
 * supabase.auth.getUser() would always see an expired session once the
 * short-lived JWT expires (~1 hour), even if the user is still active.
 *
 * HOW IT WORKS:
 *  1. createServerClient is configured to read cookies from the incoming
 *     request and write any refreshed tokens back to the outgoing response.
 *  2. supabase.auth.getUser() triggers a token refresh if the current access
 *     token is expired but the refresh token is still valid.
 *  3. The updated Set-Cookie headers are forwarded on supabaseResponse so the
 *     browser's cookie jar is kept in sync.
 *
 * IMPORTANT: Do not add logic between createServerClient and getUser().
 * Any code in between can cause subtle session bugs (random logouts, stale
 * auth state) that are extremely difficult to reproduce and debug.
 *
 * NOTE: The `runtime` config option is not supported in proxy files in
 * Next.js 16 (it throws a build error). Proxy defaults to Node.js runtime.
 */
export async function proxy(request: NextRequest) {
  // Start with a pass-through response. supabaseResponse may be replaced
  // inside setAll() if a token refresh writes new cookies.
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing (e.g. local dev without .env.local), pass through.
  // This prevents the proxy from hard-crashing before the developer sets up
  // their environment. Pages that call createClient() will throw their own
  // descriptive errors at render time.
  if (!url || !key) {
    return supabaseResponse
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        // Step 1: Update the mutable request cookies so any downstream
        // middleware or rewrites see the refreshed token in the same request.
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value, options)
        )

        // Step 2: Recreate the response so it includes the updated request
        // cookies (Next.js requires a fresh NextResponse to propagate request
        // cookie mutations to the response).
        supabaseResponse = NextResponse.next({ request })

        // Step 3: Write the refreshed session cookies onto the response so
        // the browser's cookie jar is updated.
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )

        // Step 4: Set library-provided headers (e.g. Cache-Control: private,
        // no-store) to prevent CDNs from caching responses that contain auth
        // session cookies.
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value)
        )
      },
    },
  })

  // IMPORTANT: Do NOT add code between createServerClient and getUser().
  // Triggers a token refresh if the access token is expired. The refreshed
  // tokens are written to cookies via the setAll handler above.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Run proxy on all paths EXCEPT:
     * - _next/static  — compiled JS/CSS bundles (never need auth)
     * - _next/image   — Next.js image optimization endpoint
     * - public assets — .svg, .png, .jpg, .jpeg, .gif, .webp, .ico
     *
     * Running on static assets would add latency with no benefit and
     * could accidentally strip auth cookies from cached asset responses.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

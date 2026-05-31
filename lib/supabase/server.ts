// `server-only` is compiler-enforced: importing this module from a Client
// Component will fail the Next.js build with a clear error. This module uses
// await cookies() (a server-only Next.js API) so the constraint is inherent;
// the import makes it explicit and prevents accidental client-side import.
import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client factory for Server Components and Route Handlers.
 *
 * This function is async because it awaits cookies() — required in Next.js 16
 * where request APIs (cookies, headers, params, searchParams) are all async.
 *
 * Call inside a Server Component, Route Handler, or Server Action — never at
 * module top-level. Reads env vars at call time so next build does not crash
 * when the vars are absent.
 *
 * NOTE: Server Components cannot write cookies. If supabase needs to refresh
 * a token and setAll is invoked from a Server Component, the try-catch below
 * swallows the error safely. The session will be refreshed on the next request
 * by proxy.ts (which CAN write cookies via the response).
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      'Missing required env var: NEXT_PUBLIC_SUPABASE_URL. ' +
        'Add it to .env.local (see .env.local.example).'
    )
  }
  if (!key) {
    throw new Error(
      'Missing required env var: NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Add it to .env.local (see .env.local.example).'
    )
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Called from a Server Component — cookies are read-only here.
          // proxy.ts handles session refresh and writes cookies on the response.
        }
      },
    },
  })
}

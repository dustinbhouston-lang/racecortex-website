import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client factory.
 *
 * Call this inside a component or hook — never at module top-level.
 * Reads env vars at call time so Next.js build evaluation does not crash
 * when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are absent.
 *
 * @supabase/ssr's createBrowserClient uses a singleton pattern internally,
 * so repeated calls within the same browser session reuse the same instance.
 */
export function createClient() {
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

  return createBrowserClient(url, key)
}

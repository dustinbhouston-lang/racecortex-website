// =============================================================================
// SERVER-ONLY — DO NOT IMPORT FROM CLIENT CODE OR BROWSER-SIDE COMPONENTS.
//
// This module uses SUPABASE_SERVICE_ROLE_KEY which bypasses Row Level Security
// entirely. Exposing this key to the browser would allow any visitor to read,
// write, or delete any row in the database without authentication checks.
//
// Safe usage: Server Components, Route Handlers, Server Actions.
// NEVER use: 'use client' components, pages that run in the browser.
// =============================================================================

import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client factory (service role — bypasses RLS).
 *
 * Returns a fresh client on every call. Call inside a server-only context:
 * Route Handlers, Server Components, Server Actions.
 *
 * Reads env vars at call time so next build does not crash when vars are
 * absent. Throws clearly with the missing var name if any are unset.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error(
      'Missing required env var: NEXT_PUBLIC_SUPABASE_URL. ' +
        'Add it to .env.local (see .env.local.example).'
    )
  }
  if (!serviceRoleKey) {
    throw new Error(
      'Missing required env var: SUPABASE_SERVICE_ROLE_KEY. ' +
        'Add it to .env.local (see .env.local.example). ' +
        'Never expose this key to the browser.'
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      // Disable auto-refresh — this is a server-side service-role client.
      // Sessions are managed by the user-facing @supabase/ssr clients.
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

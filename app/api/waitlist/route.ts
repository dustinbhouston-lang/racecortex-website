/**
 * /api/waitlist — landing-page early-access waitlist signup endpoint.
 *
 * POST { email: string, source?: string } → { ok: true } | { error: string }
 *
 * The `public.waitlist` table has RLS enabled with NO policies, so anon/auth
 * clients cannot read or write it. Inserts must go through the service-role
 * admin client (which bypasses RLS) — hence this server-only route.
 *
 * Duplicate emails are treated as success (idempotent): re-joining the waitlist
 * with an address already on the list is not an error from the user's side.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

// Service-role key + supabase-js use Node APIs — pin to the Node.js runtime.
export const runtime = 'nodejs'

// Postgres unique_violation — surfaced when the email is already on the list.
const UNIQUE_VIOLATION = '23505'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email =
    typeof (body as { email?: unknown })?.email === 'string'
      ? (body as { email: string }).email.trim().toLowerCase()
      : ''
  const rawSource = (body as { source?: unknown })?.source
  const source = typeof rawSource === 'string' ? rawSource.slice(0, 64) : null

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  try {
    const admin = getAdminClient()
    const { error } = await admin.from('waitlist').insert({ email, source })

    if (error) {
      // Already on the list → treat as success so the form shows the happy path.
      if (error.code === UNIQUE_VIOLATION) {
        return NextResponse.json({ ok: true })
      }
      console.error(`[waitlist] insert failed: ${error.message} (code=${error.code})`)
      return NextResponse.json({ error: 'Could not join the waitlist. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[waitlist] unexpected error: ${message}`)
    return NextResponse.json({ error: 'Could not join the waitlist. Please try again.' }, { status: 500 })
  }
}

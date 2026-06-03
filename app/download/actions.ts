'use server'

import { createClient } from '@/lib/supabase/server'

const RACECORTEX_API_URL =
  process.env.RACECORTEX_API_URL ?? 'https://racecortex-api.vercel.app'

export async function redeemInviteCode(
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Please sign in again.' }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token
  if (!accessToken) {
    return { ok: false, error: 'Please sign in again.' }
  }

  try {
    const res = await fetch(`${RACECORTEX_API_URL}/api/auth/redeem`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code.trim() }),
      signal: AbortSignal.timeout(10000),
    })

    if (res.ok) {
      return { ok: true }
    }

    if (res.status === 404) {
      return { ok: false, error: 'That invite code is invalid or already used.' }
    }
    if (res.status === 400) {
      return { ok: false, error: 'Please enter your invite code.' }
    }
    return { ok: false, error: 'Something went wrong redeeming your code. Please try again.' }
  } catch {
    return { ok: false, error: 'Something went wrong redeeming your code. Please try again.' }
  }
}

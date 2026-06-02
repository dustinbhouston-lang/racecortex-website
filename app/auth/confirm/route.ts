import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * /auth/confirm — token_hash OTP exchange (REV 6 type-routing, no `next` param).
 *
 * Handles two flows:
 *   type=email    → signup confirmation   → redirect to /download
 *   type=recovery → password reset        → redirect to /reset-password
 *
 * The Supabase email templates set `{{ .RedirectTo }}` to
 * `${origin}/auth/confirm` (no extra params). Routing is determined
 * here by the validated `type` value, not by a `next` query param.
 *
 * Security: `type` is validated against an allowlist before being
 * passed to verifyOtp(). `token_hash` is checked for presence before
 * any OTP call. All error paths redirect to /download?error=invalid_token
 * (no information leakage about what failed).
 */

const ALLOWED_TYPES = ['email', 'recovery'] as const
type AllowedType = (typeof ALLOWED_TYPES)[number]

function validateType(raw: string | null): AllowedType | null {
  if (raw && (ALLOWED_TYPES as readonly string[]).includes(raw)) {
    return raw as AllowedType
  }
  return null
}

function destinationForType(type: AllowedType): string {
  // email = signup confirmation → land on /download (user is now confirmed + signed in)
  // recovery = password reset   → land on /reset-password (session active, enter new pw)
  return type === 'email' ? '/download' : '/reset-password'
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get('token_hash')
  const rawType = searchParams.get('type')

  // Guard: token_hash must be present before attempting verifyOtp
  if (!tokenHash) {
    return NextResponse.redirect(
      new URL('/download?error=invalid_token', request.url),
      302,
    )
  }

  // Guard: type must be in the allowlist — prevents invalid OTP calls and open redirects
  const type = validateType(rawType)
  if (!type) {
    return NextResponse.redirect(
      new URL('/download?error=invalid_token', request.url),
      302,
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

  if (error) {
    return NextResponse.redirect(
      new URL('/download?error=invalid_token', request.url),
      302,
    )
  }

  // Success: session is now active. Route by type.
  return NextResponse.redirect(
    new URL(destinationForType(type), request.url),
    302,
  )
}

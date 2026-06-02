import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ResetPasswordForm } from './reset-password-form'

/**
 * /reset-password — Server Component page.
 *
 * The user arrives here AFTER /auth/confirm has:
 *   1. Consumed the recovery token (verifyOtp with type=recovery)
 *   2. Established an active session in the response cookies
 *
 * This page does NOT read any URL token params — that work is done upstream.
 * The ResetPasswordForm Client Component checks for an active session on mount
 * and presents either the new-password form or an expired-link error.
 *
 * No Suspense boundary needed — ResetPasswordForm does NOT use useSearchParams().
 */
export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-24 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-mono text-2xl font-bold text-foreground">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter and confirm your new password below.
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <ResetPasswordForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Didn&apos;t request this?{' '}
          <Link
            href="/download"
            className="text-primary transition-colors hover:text-primary/80"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

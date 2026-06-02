import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ForgotPasswordForm } from './forgot-password-form'

/**
 * /forgot-password — Server Component page.
 *
 * Renders the ForgotPasswordForm Client Component.
 * No server-side auth check needed here — anyone can request a password reset.
 */
export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-24 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-mono text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <ForgotPasswordForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link
            href="/download"
            className="text-primary transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

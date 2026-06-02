import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { SignOutButton } from '@/components/sign-out-button'

/**
 * /account — user account overview page.
 *
 * Server Component. If unauthenticated, redirects to /download.
 * Shows: email, account creation date, beta access status, sign-out button.
 *
 * NOTE: Do NOT wrap redirect() in try-catch — it throws a special internal
 * Next.js error (NEXT_REDIRECT) that must propagate to the framework.
 */
export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/download')
  }

  // Fetch beta_active via admin client (bypasses RLS for server-side trust check)
  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('beta_active')
    .eq('id', user.id)
    .single()

  const betaActive = profile?.beta_active === true

  // user.created_at is an ISO string from Supabase — convert to locale date
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-24 lg:px-8">
      <div className="w-full max-w-md">
        <h1 className="mb-8 font-mono text-2xl font-bold text-foreground">My account</h1>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col gap-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">{user.email}</p>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Member since
              </p>
              <p className="mt-1 text-sm text-foreground">{memberSince}</p>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Beta access
              </p>
              <div className="mt-2">
                {betaActive ? (
                  <Badge className="rounded-sm bg-primary/10 font-mono text-xs text-primary hover:bg-primary/10">
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="rounded-sm font-mono text-xs"
                  >
                    Inactive
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <SignOutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

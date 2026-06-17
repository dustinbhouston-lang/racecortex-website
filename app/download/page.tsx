import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'
import { DownloadSection } from './download-section'
import { SignOutButton } from '@/components/sign-out-button'

/**
 * /download — auth-gated installer download page.
 *
 * Server Component. Reads auth state via getUser() (cookie-validated JWT,
 * not getSession() which is spoofable). Renders one of two branches:
 *
 *   Unauthenticated → Sign in / Sign up tabs
 *   Authenticated   → Download UI (gated on profiles.beta_active)
 *
 * Error handling:
 *   ?error=session_expired   → shown in unauth branch (above tabs)
 *   ?error=invalid_token     → shown in unauth branch (above tabs)
 *   ?error=beta_not_active   → shown in auth branch (inside DownloadSection)
 *   ?error=server_error      → shown in auth branch (inside DownloadSection)
 */

interface DownloadPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function DownloadPage({ searchParams }: DownloadPageProps) {
  // Next.js 16: searchParams is async — must await before reading
  const { error } = await searchParams

  const supabase = await createClient()
  // NEVER use getSession() for auth decisions — it reads cookies without server validation.
  // getUser() validates the JWT against Supabase's auth server on every call.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── UNAUTHENTICATED STATE ──────────────────────────────────────────────────
  if (!user) {
    let errorMessage: string | undefined
    if (error === 'session_expired') {
      errorMessage = 'Your session expired. Please sign in again.'
    } else if (error === 'invalid_token') {
      errorMessage = 'This link is invalid or has expired. Please try again.'
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-24 lg:px-8">
        <div className="w-full max-w-md">
          {/* Explanatory paragraph above the card */}
          <p className="mb-8 text-center text-base text-muted-foreground">
            RaceCortex is in closed beta. Sign in to download the installer, or sign up if you
            have an invite code.
          </p>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <Tabs defaultValue="sign-in">
                <TabsList className="mb-6 grid w-full grid-cols-2 rounded-sm">
                  <TabsTrigger value="sign-in" className="rounded-sm">
                    Sign in
                  </TabsTrigger>
                  <TabsTrigger value="sign-up" className="rounded-sm">
                    Sign up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sign-in">
                  <SignInForm initialError={errorMessage} />
                </TabsContent>

                <TabsContent value="sign-up">
                  <SignUpForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // ── AUTHENTICATED STATE ───────────────────────────────────────────────────
  // Fetch beta_active using the admin client (service role bypasses RLS).
  // This is a trusted server-side check — do NOT use the cookie-based `supabase`
  // client here as it would be subject to RLS policies on the profiles table.
  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('beta_active')
    .eq('id', user.id)
    .single()

  const betaActive = profile?.beta_active === true

  // Error codes that arrive in the AUTH branch (user IS signed in):
  //   beta_not_active — signed-in user lacking beta access, redirected by /api/download
  //   server_error    — R2 client failure after auth passed, redirected by /api/download
  let downloadError: string | undefined
  if (error === 'beta_not_active') {
    downloadError =
      'Beta access not yet active. Please redeem your invite code in the RaceCortex app, or contact Dustin.'
  } else if (error === 'server_error') {
    downloadError =
      'Something went wrong generating your download link. Please try again in a moment.'
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-24 lg:px-8">
      <div className="w-full max-w-lg">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col gap-6 p-8">
            {/* Signed-in identity */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Signed in as
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">{user.email}</p>
            </div>

            <Separator />

            {/* Build info */}
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                RaceCortex v1.0.0
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Full AI race engineer for iRacing. Real-time voice coaching,
                120+ telemetry channels, lap delta analysis, and stint strategy planning. Requires
                a compatible wheel base and Windows 10/11.
              </p>
            </div>

            <Separator />

            {/* Download section — handles beta_active state + post-click downloading view */}
            <DownloadSection betaActive={betaActive} errorMessage={downloadError} />

            <Separator />

            {/* Sign out */}
            <div className="flex justify-end">
              <SignOutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

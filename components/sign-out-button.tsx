'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface SignOutButtonProps {
  className?: string
}

/**
 * Shared sign-out button — used on /download (auth state) and /account.
 *
 * Calls supabase.auth.signOut() then router.refresh() so the Server
 * Component re-runs with the cleared session cookie and renders the
 * correct unauthenticated state (or redirect for /account).
 */
export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSignOut}
      disabled={loading}
      className={className}
    >
      {loading && <Spinner className="size-3" />}
      Sign out
    </Button>
  )
}

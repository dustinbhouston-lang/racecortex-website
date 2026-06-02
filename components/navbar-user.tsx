'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * NavbarUser — auth-aware user widget for the desktop navbar.
 *
 * Reads the Supabase session from cookies (no server round-trip) using
 * getSession() on the browser client. This is appropriate for display
 * purposes — getSession() in the browser reads from the cookie that
 * proxy.ts keeps fresh. We are NOT making an authorization decision here,
 * so getSession() (display only) is correct vs getUser() (security gate).
 *
 * Subscribes to onAuthStateChange to stay in sync across sign-in/sign-out.
 */
export function NavbarUser() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial state from cookie — fast, no network call
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Keep in sync: sign in from another tab, session expiry, manual sign-out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  // Skeleton while determining auth state — matches the height of the nav items
  if (loading) {
    return (
      <div className="h-4 w-16 animate-pulse rounded-sm bg-secondary" aria-hidden="true" />
    )
  }

  // Signed out — plain link matches the existing nav link style
  if (!user) {
    return (
      <Link
        href="/download"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Log in
      </Link>
    )
  }

  // Signed in — dropdown with account link and sign-out
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:text-foreground">
        <span className="max-w-[160px] truncate">{user.email}</span>
        <ChevronDown size={13} className="shrink-0 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem asChild>
          <Link href="/account">My account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive-foreground focus:text-destructive"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

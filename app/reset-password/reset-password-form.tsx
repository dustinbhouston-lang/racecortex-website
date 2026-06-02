'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

/**
 * /reset-password — Client Component form.
 *
 * The user arrives here AFTER /auth/confirm has consumed the recovery token
 * and established an active session. No URL token params are read here.
 *
 * On mount: checks for an active session via getSession().
 *   - No session → shows expired-link error (same root cause from user POV)
 *   - Session present → shows new password form
 *
 * REV 7 NOTE: We do NOT attempt to detect whether the session is specifically
 * a "recovery" session vs a normal session. Supabase's session object does
 * not durably expose this after page load. We just check session exists,
 * attempt updateUser, and let Supabase's error surface invalid/expired tokens.
 */

const RECOVERY_ERROR_MESSAGE =
  'Recovery link expired or already used. Please request a new password reset.'

const schema = z
  .object({
    password: z
      .string()
      .min(10, 'Password must be at least 10 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordForm() {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  // Check for active session on mount (set by /auth/confirm after verifyOtp)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
      setSessionChecked(true)
    })
  }, [])

  const onSubmit = async (values: FormValues) => {
    setUpdateError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: values.password })
    if (error) {
      // Any error from updateUser (expired session, invalid state, etc.)
      // surfaces the same user-facing message: link is expired/used.
      setUpdateError(RECOVERY_ERROR_MESSAGE)
      return
    }
    // On success, session continues as a regular signed-in session.
    // Redirect to /download where the user can now download the installer.
    router.push('/download')
  }

  // Loading while session check runs
  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="size-5" />
      </div>
    )
  }

  // No active session — recovery link was invalid, expired, or already used
  if (!hasSession) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertDescription>{RECOVERY_ERROR_MESSAGE}</AlertDescription>
        </Alert>
        <Link
          href="/forgot-password"
          className="text-center text-sm text-primary transition-colors hover:text-primary/80"
        >
          Request a new password reset
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {updateError && (
          <Alert variant="destructive">
            <AlertDescription>
              {updateError}{' '}
              <Link href="/forgot-password" className="underline underline-offset-4">
                Request a new reset.
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Min. 10 characters"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-1 h-11 rounded-sm"
        >
          {form.formState.isSubmitting ? <Spinner className="mr-2" /> : null}
          Update password
        </Button>
      </form>
    </Form>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

/**
 * ForgotPasswordForm — Client Component inside /forgot-password.
 *
 * On submit, calls supabase.auth.resetPasswordForEmail with:
 *   redirectTo: `${window.location.origin}/auth/confirm`
 *
 * /auth/confirm detects type=recovery and redirects to /reset-password.
 * No `next` param is needed — type-based routing is used throughout.
 */
export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      // Template literal required — backtick not string concatenation.
      // /auth/confirm routes by type: type=recovery → /reset-password.
      redirectTo: `${window.location.origin}/auth/confirm`,
    })
    if (error) {
      setSubmitError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <Alert>
        <AlertDescription>
          If an account with that email exists, we&apos;ve sent a password reset link. Check your
          inbox — it may take a minute to arrive.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
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
          Send reset link
        </Button>
      </form>
    </Form>
  )
}

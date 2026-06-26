'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function CtaSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email address.')
      setStatus('error')
      return
    }
    setError('')
    setStatus('submitting')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing-cta' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'

  return (
    <section
      id="early-access"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-[#26262B]"
    >
      {/* Legibility scrim — no opaque fill, global SiteBackground shows through */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(12,12,14,0.65) 0%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:px-8 lg:py-36">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
          Beta Access
        </p>
        <h2
          id="cta-heading"
          className="font-display font-bold uppercase text-balance"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Get Your Engineer{' '}
          <span className="text-[#FF4D00]">On The Radio.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-[#5C5E66]">
          RaceCortex is invite-only during beta. Join the waitlist and we&apos;ll reach out when
          your spot is ready.
        </p>

        {status === 'success' ? (
          <div className="mt-10 mx-auto max-w-sm rounded-[6px] border border-[#00D26A]/30 bg-[#00D26A]/10 px-6 py-5">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#00D26A] mb-1">
              You&apos;re on the list
            </span>
            <span className="block font-sans text-sm text-[#8A8C92]">
              We&apos;ll be in touch when your beta access is ready.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            noValidate
            aria-label="Early access waitlist form"
          >
            <div className="flex flex-col w-full sm:w-auto">
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') {
                    setError('')
                    setStatus('idle')
                  }
                }}
                placeholder="your@email.com"
                aria-describedby={error ? 'cta-email-error' : undefined}
                aria-invalid={!!error}
                disabled={submitting}
                className="w-full sm:w-72 rounded-[4px] border border-[#26262B] bg-[#1A1A1F] px-4 py-3 font-mono text-sm text-[#F4F4F2] placeholder-[#5C5E66] outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] transition-colors disabled:opacity-60"
              />
              {error && (
                <span id="cta-email-error" role="alert" className="mt-1.5 text-left font-mono text-[10px] text-[#FF3B30]">
                  {error}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto rounded-[4px] bg-[#FF4D00] px-7 py-3 font-display text-sm font-semibold uppercase tracking-[0.1em] text-[#0C0C0E] transition-colors hover:bg-[#CC3E00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Joining…' : 'Get Early Access'}
            </button>
          </form>
        )}

        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-[#5C5E66]">
          No credit card required &bull; Invite-only beta
        </p>
      </div>
    </section>
  )
}

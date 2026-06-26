'use client'

import { useEffect, useRef, useState } from 'react'

type Role = 'clive' | 'driver'

interface RadioLine {
  id: number
  role: Role
  text: string
  delay: number
}

const TRANSCRIPT: RadioLine[] = [
  { id: 1, role: 'clive', text: 'Gap behind 0.8 and closing — defend into 1.', delay: 0 },
  { id: 2, role: 'clive', text: 'Yellow sector 2, lift.', delay: 800 },
  { id: 3, role: 'driver', text: "How's my fuel?", delay: 1800 },
  { id: 4, role: 'clive', text: 'Two laps to spare. Short-shift 3 and 4.', delay: 2600 },
  { id: 5, role: 'clive', text: 'Box this lap, you\'ll undercut P3.', delay: 3600 },
  { id: 6, role: 'driver', text: 'Gap to P3 after the stop?', delay: 4600 },
  { id: 7, role: 'clive', text: 'Estimated 2.4. He pits next lap, you come out ahead.', delay: 5400 },
]

function RadioEntry({ line, visible }: { line: RadioLine; visible: boolean }) {
  const isClive = line.role === 'clive'
  return (
    <div
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      style={{ transitionDelay: visible ? '0ms' : undefined }}
    >
      <div className={`flex items-start gap-3 ${isClive ? '' : 'flex-row-reverse'}`}>
        {/* Role badge */}
        <div className="shrink-0 mt-0.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${
              isClive
                ? 'border-[#FF4D00]/40 bg-[#FF4D00]/10 text-[#FF4D00]'
                : 'border-[#26262B] bg-[#202026] text-[#5C5E66]'
            }`}
          >
            {isClive ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]" aria-hidden="true" />
                Clive
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-[#5C5E66]" aria-hidden="true" />
                Driver
              </>
            )}
          </span>
        </div>

        {/* Message */}
        <div
          className={`rounded-[6px] border px-4 py-2.5 max-w-sm md:max-w-md ${
            isClive
              ? 'border-[#26262B] bg-[#1A1A1F] text-[#F4F4F2]'
              : 'border-[#26262B] bg-[#202026] text-[#8A8C92]'
          }`}
        >
          <p className="font-sans text-sm leading-relaxed">{line.text}</p>
        </div>
      </div>
    </div>
  )
}

export function AiEngineer() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    // Collect every timer so the effect cleanup can clear them. Returning the
    // cleanup from inside forEach (as before) only returned from the callback —
    // the timers leaked and fired setState after unmount.
    const timers = TRANSCRIPT.map((line) =>
      setTimeout(() => {
        setVisibleCount((c) => c + 1)
      }, line.delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [hasStarted])

  return (
    <section
      id="ai-engineer"
      ref={sectionRef}
      aria-labelledby="ai-engineer-heading"
      className="relative py-24 lg:py-32"
    >
      {/* Faint ember from top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 5% 50%, rgba(255,77,0,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
            The Differentiator
          </p>
          <h2
            id="ai-engineer-heading"
            className="font-display font-bold uppercase text-balance"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Voice-First.{' '}
            <span className="text-[#8A8C92]">No Menus Mid-Corner.</span>
          </h2>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[#5C5E66]">
            Clive calls the race in short, direct pit-wall radio. Hold push-to-talk and ask anything
            — gaps, fuel, strategy — without lifting your eyes from the track.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Transcript panel */}
          <div
            className="rounded-[6px] border border-[#26262B] bg-[rgba(26,26,31,0.92)] overflow-hidden"
            role="log"
            aria-label="Clive radio transcript"
            aria-live="polite"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[#26262B] px-4 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5C5E66]">
                Team Radio
              </span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00] ember-pulse" aria-hidden="true" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#FF4D00]">
                  Live
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-4 p-5 min-h-[320px]">
              {TRANSCRIPT.map((line, i) => (
                <RadioEntry key={line.id} line={line} visible={i < visibleCount} />
              ))}
            </div>
          </div>

          {/* Feature callouts */}
          <div className="flex flex-col gap-6">
            {[
              {
                label: 'Voice-First',
                title: 'Clive speaks to you',
                body: 'A calm, competent voice calls gaps, traffic, flags, and strategy — no reading overlays at 200 km/h.',
              },
              {
                label: 'Push-to-Talk',
                title: 'Ask anything, mid-session',
                body: '"Gap behind?" "How\'s my fuel?" "When do I pit?" Hold the button. Get a direct answer.',
              },
              {
                label: 'Pit Wall Radio',
                title: 'Short. Direct. Professional.',
                body: "Clive doesn't narrate laps. He calls what matters, when it matters, in the language real engineers use.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[6px] border border-[#26262B] bg-[rgba(26,26,31,0.6)] p-5"
              >
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4D00]">
                  {item.label}
                </p>
                <h3 className="mb-2 font-display font-semibold uppercase tracking-tight text-[#F4F4F2]">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#5C5E66]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

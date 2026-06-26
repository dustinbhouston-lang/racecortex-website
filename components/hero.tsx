import { CliveIndicator } from './clive-indicator'

const STATS = [
  { value: '120+', label: 'Telemetry Channels' },
  { value: '60Hz', label: 'Live Sampling' },
  { value: 'Real-Time', label: 'Race Comms' },
]

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
    >
      {/* Legibility scrims — no opaque fill, global SiteBackground shows through */}
      {/* Radial darkening centred behind headline text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 42%, rgba(12,12,14,0.62) 0%, transparent 75%)',
        }}
      />
      {/* Bottom fade so stat strip stays readable */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-40 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(12,12,14,0.85), transparent)' }}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-40 text-center lg:px-8">

        {/* Eyebrow */}
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
          iRacing &mdash; AI Race Engineer
        </p>

        {/* Headline */}
        <h1
          id="hero-headline"
          className="font-display font-bold uppercase text-balance leading-[0.9] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          <span className="block text-[#F4F4F2]">Your AI</span>
          <span className="block text-[#FF4D00]">Race Engineer</span>
        </h1>

        {/* Subcopy */}
        <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-[#8A8C92] text-pretty md:text-lg">
          An AI engineer that rides shotgun every session &mdash; it reads your telemetry, calls
          your race, and answers when you ask, so you can keep your eyes on the track.
        </p>

        {/* Clive indicator */}
        <div className="mt-12 mb-12">
          <CliveIndicator />
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a
            href="#early-access"
            className="rounded-[4px] bg-[#FF4D00] px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.1em] text-[#0C0C0E] transition-colors hover:bg-[#CC3E00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0E]"
          >
            Get Early Access
          </a>
        </div>
      </div>

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#26262B]">
        <div className="mx-auto max-w-7xl">
          <dl className="grid grid-cols-3 divide-x divide-[#26262B]">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 px-4 py-4 md:flex-row md:justify-center md:gap-3"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-lg font-semibold tabular text-[#F4F4F2] md:text-xl">
                  {s.value}
                </dd>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#5C5E66] text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

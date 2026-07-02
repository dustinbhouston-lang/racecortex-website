interface Feature {
  label: string
  title: string
  body: string
  tag?: string
}

const FEATURES: Feature[] = [
  {
    label: 'PTT',
    title: 'Ask-Anything Push-to-Talk',
    body: 'Hold your button and ask — gap ahead, fuel state, tyre age, who\'s pitting. Answered in about a second.',
  },
  {
    label: 'Pit Service',
    title: 'Set Fuel & Tyres by Voice',
    body: 'Call your pit service hands-free — \'fuel for twelve, four tyres\' — set before you reach the lane. No black-box fumbling.',
  },
  {
    label: 'Strategy',
    title: 'Fuel & Strategy Calls',
    body: 'Live consumption, laps to empty, and undercut windows — the numbers run for you and called when they matter.',
  },
  {
    label: 'Incidents',
    title: 'Incident & Flag Heads-Up',
    body: 'Yellows, incidents, and track status the moment they happen — called by sector, so you know what\'s ahead.',
  },
  {
    label: 'Spotter',
    title: 'Live Spotter & Gap Calls',
    body: 'Cars alongside, closing gaps, and who\'s on your tail — the spotter basics, plus the context to act on them.',
  },
  {
    label: 'Telemetry',
    title: '120+ Live Channels at 60Hz',
    body: 'Reads iRacing\'s full telemetry stream — speed, inputs, aero, tyre temps and more — sixty times a second.',
  },
]

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative py-24 lg:py-32 border-t border-[#26262B]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
            Capabilities
          </p>
          <h2
            id="features-heading"
            className="font-display font-bold uppercase text-balance"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            From Green Flag{' '}
            <span className="text-[#AEB1B8]">to Checkered.</span>
          </h2>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[#8A8C92]">
            Everything a race engineer does — gaps, fuel, strategy, incidents, even your pit stop — by voice, so your eyes never leave the track.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-px bg-[#26262B] rounded-[8px] overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.label}
              className="flex flex-col gap-4 bg-[#0C0C0E] p-6 hover:bg-[#1A1A1F] transition-colors duration-200"
            >
              {/* Label + optional tag */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4D00]">
                  {f.label}
                </span>
                {f.tag && (
                  <span className="rounded-[3px] border border-[#FFC400]/30 bg-[#FFC400]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-[#FFC400]">
                    {f.tag}
                  </span>
                )}
              </div>

              {/* Separator */}
              <div className="h-px w-8 bg-[#26262B]" aria-hidden="true" />

              {/* Content */}
              <div>
                <h3 className="mb-2 font-display font-semibold uppercase tracking-tight text-[#F4F4F2] text-sm">
                  {f.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#8A8C92]">{f.body}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8C92]">
          Built for iRacing today — more sims on the roadmap.
        </p>
      </div>
    </section>
  )
}

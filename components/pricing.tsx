const PLAN_INCLUDES = [
  'Full voice AI race engineer',
  '120+ live telemetry channels at 60Hz',
  'Push-to-talk ask-anything',
  'Gap, traffic & incident calls',
  'Fuel & strategy comms',
  'Full Ignition overlay suite included',
  'Priority support & beta feedback access',
]

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative py-24 lg:py-32 border-t border-[#26262B]"
    >
      {/* Faint center ember */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,77,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="font-display font-bold uppercase text-balance"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            One Plan.{' '}
            <span className="text-[#8A8C92]">Everything Included.</span>
          </h2>
        </div>

        {/* Single centered card */}
        <div className="mx-auto max-w-sm">
          <div className="rounded-[8px] border border-[#FF4D00]/40 bg-[rgba(26,26,31,0.92)] overflow-hidden">
            {/* Card header */}
            <div className="border-b border-[#26262B] px-6 py-5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4D00]">
                  Beta Access
                </span>
                <span className="rounded-[3px] border border-[#FF4D00]/30 bg-[#FF4D00]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-[#FF4D00]">
                  Early Beta
                </span>
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-[#F4F4F2] text-xl">
                RaceCortex
              </h3>
            </div>

            {/* Price */}
            <div className="border-b border-[#26262B] px-6 py-6">
              <div className="flex items-end gap-2">
                <span className="font-display font-bold text-4xl text-[#F4F4F2]">
                  Free
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#5C5E66]">
                during the closed beta
              </p>
              <p className="mt-3 font-sans text-xs leading-relaxed text-[#5C5E66]">
                The closed beta is free. Paid plans arrive at launch — beta testers lock in founder
                pricing. Invite-only: join the waitlist to secure your spot.
              </p>
            </div>

            {/* What&apos;s included */}
            <div className="px-6 py-5">
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#5C5E66]">
                Includes
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {PLAN_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4D00]"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-sm leading-snug text-[#8A8C92]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <a
                href="#early-access"
                className="block rounded-[4px] bg-[#FF4D00] py-3.5 text-center font-display text-sm font-semibold uppercase tracking-[0.1em] text-[#0C0C0E] transition-colors hover:bg-[#CC3E00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0E]"
              >
                Get Early Access
              </a>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.15em] text-[#5C5E66]">
                Beta is invite-based — waitlist open now
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

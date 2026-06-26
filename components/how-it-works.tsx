const STEPS = [
  {
    num: '01',
    title: 'Install & Sign In',
    body: 'Download the RaceCortex desktop app, sign in with your account, and let it connect to iRacing. No telemetry configuration required.',
  },
  {
    num: '02',
    title: 'Bind Your Push-to-Talk',
    body: 'Map any key or button to PTT in the settings. Wheel buttons, keyboard keys, or HOTAS — anything you can bind in iRacing works here.',
  },
  {
    num: '03',
    title: 'Drive. The Engineer Does the Rest.',
    body: 'Join a session. Your engineer monitors the telemetry feed and calls what matters. Hold push-to-talk to ask anything. Eyes stay on track.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative py-24 lg:py-32 border-t border-[#26262B]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
            Quick Start
          </p>
          <h2
            id="how-it-works-heading"
            className="font-display font-bold uppercase text-balance"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Up and Running{' '}
            <span className="text-[#8A8C92]">in Three Steps.</span>
          </h2>
        </div>

        {/* Steps */}
        <ol className="relative grid gap-0 md:grid-cols-3" aria-label="Setup steps">
          {/* Connector line — desktop only */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[2.25rem] left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-[#26262B]"
          />

          {STEPS.map((step, i) => (
            <li
              key={step.num}
              className={`relative flex flex-col ${i < STEPS.length - 1 ? 'pb-12 md:pb-0 md:pr-8' : ''}`}
            >
              {/* Vertical connector — mobile only */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="md:hidden absolute left-[1.375rem] top-[3rem] bottom-0 w-px bg-[#26262B]"
                />
              )}

              <div className="flex items-start gap-5 md:flex-col md:gap-0">
                {/* Step number */}
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] border border-[#26262B] bg-[#1A1A1F] md:mb-6">
                  <span className="font-mono text-sm font-semibold tabular text-[#FF4D00]">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-1 md:pt-0">
                  <h3 className="mb-2 font-display font-semibold uppercase tracking-tight text-[#F4F4F2]">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-[#5C5E66]">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

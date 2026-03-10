import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "CONNECT",
    description:
      "Link RaceCortex to your sim. The AI engineer starts listening to your telemetry stream immediately -- zero config, zero performance impact.",
  },
  {
    number: "02",
    title: "DRIVE",
    description:
      "Your AI engineer rides shotgun from the first lap. It watches every input, every corner, every braking zone in real time.",
  },
  {
    number: "03",
    title: "GET COACHED",
    description:
      "Mid-session, the AI calls out braking cues, suggests lines, and flags setup imbalances. Like a real race engineer in your ear.",
  },
  {
    number: "04",
    title: "EVOLVE",
    description:
      "After each session the AI builds your driver profile. It learns your tendencies, adapts its coaching, and sets new performance targets automatically.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-5 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - Image */}
          <div className="relative overflow-hidden rounded-sm border border-border">
            <div className="relative aspect-square lg:aspect-auto lg:h-full">
              <Image
                src="/images/track-analysis.jpg"
                alt="Racing track analysis with optimal racing line overlay"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>

          {/* Right - Steps */}
          <div className="flex flex-col justify-center">
            <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
              How It Works
            </span>
            <h2 className="mt-4 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              <span className="text-balance">From install to insight in minutes</span>
            </h2>

            <div className="mt-10 flex flex-col gap-8 lg:mt-12">
              {steps.map((step, i) => (
                <div key={step.number} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-sm font-bold text-primary">
                      {step.number}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h3 className="font-mono text-base font-bold tracking-wide text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

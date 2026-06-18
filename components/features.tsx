import Image from "next/image"
import { Activity, Gauge, Layers, Radio, Zap } from "lucide-react"

const features = [
  {
    icon: Activity,
    title: "Live Telemetry",
    description:
      "Stream real-time data from your simulator. Throttle, brake, steering, tire temps, and 120+ telemetry channels, sampled up to 60Hz.",
  },
  {
    icon: Gauge,
    title: "Lap Comparison",
    description:
      "Compare your laps against personal bests and see exactly where you gain or lose time.",
  },
  {
    icon: Layers,
    title: "Setup Lab",
    description:
      "Tell Clive how the car feels — understeer, curbs, traction — and get manufacturer-grounded setup changes for supported cars. Full Setup Lab coming.",
  },
  {
    icon: Radio,
    title: "Multi-Sim Support",
    description:
      "Built for iRacing today — ACC, rFactor 2, and Le Mans Ultimate are on the roadmap. One AI engineer, every sim.",
  },
  {
    icon: Zap,
    title: "Stint Strategy",
    description:
      "Live fuel, stint, and pit-window strategy — your engineer calls the numbers as the race unfolds.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-5 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Platform
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-balance">Built around your AI engineer</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            The AI race engineer is the brain — it turns raw telemetry into race insight no overlay can give you. These are the tools it reads.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/30 lg:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <feature.icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Large visual break */}
        <div className="mt-16 overflow-hidden rounded-sm border border-border lg:mt-24">
          <div className="relative aspect-[16/9] sm:aspect-[21/9]">
            <Image
              src="/images/telemetry-dashboard.jpg"
              alt="RaceCortex telemetry dashboard showing real-time racing data"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
              <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
                Telemetry Dashboard
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                Every data point. One clear picture.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

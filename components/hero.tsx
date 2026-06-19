import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { CliveIndicator } from "@/components/clive-indicator"

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-20 lg:px-8">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-carbon-streak.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">
            Powered by AI
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-8xl">
          <span className="text-balance">
            YOUR AI
            <br />
            <span className="text-primary">RACE ENGINEER</span>
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mt-8 lg:text-xl">
          An AI engineer that rides shotgun every session — it reads your telemetry, runs your race strategy, and answers when you ask, so you can keep your eyes on the track.
        </p>

        <div className="mt-10 lg:mt-12">
          <CliveIndicator />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#pricing"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:h-14 sm:px-8"
          >
            Meet Your AI Engineer
            <ArrowRight size={18} />
          </a>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-sm border border-border bg-secondary/50 px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary sm:h-14 sm:px-8"
          >
            See How It Works
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid w-full grid-cols-3 gap-4 border-t border-border pt-8 lg:mt-20 lg:gap-8">
          {[
            { value: "120+", label: "Telemetry channels" },
            { value: "60Hz", label: "Live sampling" },
            { value: "Real-time", label: "Live race comms" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-mono text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-center text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

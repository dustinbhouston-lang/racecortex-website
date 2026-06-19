import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-orange-trails.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="flex flex-col items-center rounded-sm border border-primary/20 bg-primary/5 px-6 py-16 text-center lg:px-12 lg:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-balance">
              YOUR AI ENGINEER
              <br />
              <span className="text-primary">IS WAITING</span>
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
            Stop scanning overlays mid-corner. Let an AI race engineer read the data, call your strategy, and hand you the insight to race smarter.
          </p>
          <a
            href="#pricing"
            className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Early Access
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

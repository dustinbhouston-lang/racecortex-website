import { Check } from "lucide-react"

const plan = {
  name: "Early Access",
  price: "$12",
  period: "/mo",
  description: "The full AI race engineer for iRacing.",
  features: [
    "AI Race Engineer (Clive) — real-time voice",
    "Full 120+ channel telemetry",
    "Unlimited session history",
    "Lap delta analysis",
    "Stint strategy planner",
    "Setup Lab access",
    "Priority support",
  ],
  cta: "Get Early Access",
}

export function Pricing() {
  return (
    <section id="pricing" className="relative px-5 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-balance">One plan. The full pit crew.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Everything RaceCortex does, one price. Free for beta testers while we&apos;re in early access.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-md lg:mt-16">
          <div className="flex flex-col rounded-sm border border-primary bg-primary/5 p-6 lg:p-8">
            <h3 className="font-display text-lg font-bold text-foreground">
              {plan.name}
            </h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-mono text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-base text-muted-foreground">
                {plan.period}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {plan.description}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="/download"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {plan.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

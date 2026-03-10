import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For casual sim racers getting started with data.",
    features: [
      "Basic telemetry capture",
      "3 session history",
      "Lap time comparison",
      "1 simulator supported",
      "Community access",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For competitive racers who want every advantage.",
    features: [
      "Full 200+ channel telemetry",
      "Unlimited session history",
      "AI Race Engineer",
      "All simulators supported",
      "Setup Lab access",
      "Stint strategy planner",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/mo",
    description: "For organized teams and league competitors.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared setup library",
      "Team performance analytics",
      "Role-based access",
      "Custom API integration",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative px-5 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-4 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-balance">Choose your racing tier</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Start for free. Upgrade when you need the full pit crew.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-sm border p-6 lg:p-8 ${
                plan.highlighted
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
                  Most Popular
                </span>
              )}
              <h3 className="font-mono text-lg font-bold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-base text-muted-foreground">
                    {plan.period}
                  </span>
                )}
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
                href="#"
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-sm text-base font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

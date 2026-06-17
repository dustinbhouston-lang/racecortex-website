"use client"

import { useEffect, useState } from "react"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

const channels = [
  { label: "Speed", value: "287", unit: "km/h", bar: 82 },
  { label: "Throttle", value: "100", unit: "%", bar: 100 },
  { label: "Brake", value: "0", unit: "%", bar: 0 },
  { label: "Gear", value: "6", unit: "th", bar: 75 },
  { label: "RPM", value: "11,240", unit: "", bar: 88 },
  { label: "Tire FL", value: "98.2", unit: "C", bar: 72 },
  { label: "Tire FR", value: "101.1", unit: "C", bar: 78 },
  { label: "Fuel", value: "34.2", unit: "L", bar: 45 },
]

export function TelemetryPreview() {
  return (
    <section id="telemetry" className="relative px-5 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Live Data
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-balance">120+ channels. Zero guesswork.</span>
          </h2>
        </div>

        {/* Telemetry mock UI */}
        <div className="mt-12 overflow-hidden rounded-sm border border-border bg-card lg:mt-16">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                Live Session
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                Spa-Francorchamps
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Lap 14/23
              </span>
            </div>
          </div>

          {/* Data grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {channels.map((ch) => (
              <div
                key={ch.label}
                className="flex flex-col border-b border-r border-border p-4 last:border-r-0 lg:p-5"
              >
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {ch.label}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-xl font-bold text-foreground lg:text-2xl">
                    {ch.value}
                  </span>
                  {ch.unit && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {ch.unit}
                    </span>
                  )}
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${ch.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom lap times */}
          <div className="border-t border-border px-4 py-4 lg:px-6">
            <div className="flex flex-wrap items-center gap-6 lg:gap-10">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Current Lap
                </span>
                <span className="font-mono text-lg font-bold text-foreground">
                  1:44.231
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Best Lap
                </span>
                <span className="font-mono text-lg font-bold text-primary">
                  1:43.892
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Delta
                </span>
                <span className="font-mono text-lg font-bold text-red-400">
                  +0.339
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Session Best
                </span>
                <span className="font-mono text-lg font-bold text-muted-foreground">
                  1:43.112
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

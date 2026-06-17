"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Brain, Mic, Sparkles } from "lucide-react"

const chatMessages = [
  {
    role: "engineer" as const,
    text: "Braking 12m too late into T3. You're losing 0.18s every lap there. Try braking at the 75m board.",
    delay: 0,
  },
  {
    role: "driver" as const,
    text: "Adjusted braking point. How's the entry now?",
    delay: 1200,
  },
  {
    role: "engineer" as const,
    text: "Better. Entry speed up 4km/h. You're now carrying more speed through the apex. Mid-corner balance looks good on the data.",
    delay: 2400,
  },
  {
    role: "driver" as const,
    text: "Still feel a snap on exit. Rear feels loose.",
    delay: 3800,
  },
  {
    role: "engineer" as const,
    text: "Confirmed. Rear slip angle peaks at 7.2 on exit. I recommend +1 rear wing and softening the rear ARB to medium. Predicted gain: 0.09s/lap.",
    delay: 5000,
  },
]

const capabilities = [
  {
    icon: Mic,
    title: "Real-Time Voice Coaching",
    description: "Get spoken callouts through corners, braking cues, and strategic updates just like a real pit wall.",
  },
  {
    icon: Brain,
    title: "Learns Your Driving Style",
    description: "The AI adapts to your strengths and weaknesses over time, giving progressively smarter feedback each session.",
  },
  {
    icon: Sparkles,
    title: "Setup Recommendations",
    description: "Analyzes your telemetry to suggest car setup changes with predicted lap time impact before you make a single adjustment.",
  },
]

export function AiEngineer() {
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    if (visibleMessages >= chatMessages.length) return

    const nextDelay = chatMessages[visibleMessages]
      ? chatMessages[visibleMessages].delay - (visibleMessages > 0 ? chatMessages[visibleMessages - 1].delay : 0)
      : 1200

    const timeout = setTimeout(() => {
      setVisibleMessages((v) => v + 1)
    }, visibleMessages === 0 ? 800 : nextDelay)

    return () => clearTimeout(timeout)
  }, [visibleMessages])

  return (
    <section id="ai-engineer" className="relative px-5 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
            <Brain size={14} className="text-primary" />
            <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
              Core Feature
            </span>
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-6xl">
            <span className="text-balance">
              AN ENGINEER THAT
              <br />
              <span className="text-primary">NEVER SLEEPS</span>
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            Most sim racers train alone. RaceCortex gives you an AI race engineer that analyzes every input, 
            coaches you through every corner, and gets smarter the more you drive.
          </p>
        </div>

        {/* Main showcase: image + chat UI */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-0">
          {/* Left - Dramatic image */}
          <div className="relative overflow-hidden rounded-sm border border-border lg:rounded-r-none">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <Image
                src="/images/ai-engineer.jpg"
                alt="AI race engineer analyzing telemetry data in a dark pit garage"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <Brain size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-foreground">Cortex AI</span>
                    <p className="text-xs text-muted-foreground">Your personal race engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Simulated chat interface */}
          <div className="flex flex-col overflow-hidden rounded-sm border border-border bg-card lg:rounded-l-none lg:border-l-0">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  Live Session - Spa-Francorchamps
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">Lap 14</span>
            </div>

            {/* Chat messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
              {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "driver" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[85%] rounded-sm px-4 py-3 ${
                      msg.role === "engineer"
                        ? "border border-primary/20 bg-primary/5"
                        : "bg-secondary"
                    }`}
                  >
                    <span className={`block text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5 ${
                      msg.role === "engineer" ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {msg.role === "engineer" ? "Cortex AI" : "You"}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}

              {visibleMessages < chatMessages.length && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-sm border border-primary/20 bg-primary/5 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center gap-3 rounded-sm border border-border bg-secondary/50 px-4 py-3">
                <span className="flex-1 text-sm text-muted-foreground">Ask your engineer...</span>
                <Mic size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="flex flex-col rounded-sm border border-primary/20 bg-primary/5 p-6 lg:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <cap.icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

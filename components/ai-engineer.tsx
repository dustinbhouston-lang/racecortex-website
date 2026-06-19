"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Mic, Radio, Sparkles, Volume2 } from "lucide-react"

const chatMessages = [
  { role: "engineer" as const, text: "Fuel's two short to the flag at this pace. Lift-and-coast out of sector 3 and I'll re-run it.", delay: 0 },
  { role: "driver" as const,   text: "Copy. What's the gap to P3?", delay: 1200 },
  { role: "engineer" as const, text: "1.4 and closing — you're three tenths a lap quicker. He pits in two; stay out and track position is yours.", delay: 2400 },
  { role: "driver" as const,   text: "Can I make the end on this set?", delay: 3800 },
  { role: "engineer" as const, text: "On the lift-and-coast, yes — you'll cross the line with half a litre. Tyre deg's flat over the last five laps, you're good.", delay: 5000 },
]

const capabilities = [
  {
    icon: Mic,
    title: "Real-Time Race Comms",
    description: "Ask a question, or get spoken updates on gaps, fuel, traffic, and strategy — just like a real pit wall.",
  },
  {
    icon: Brain,
    title: "Knows How You Race",
    description: "Clive builds a profile of your tendencies and adapts how it calls the race to you — not a one-size-fits-all robot.",
  },
  {
    icon: Sparkles,
    title: "Setup Recommendations",
    description: "Analyzes your telemetry and car balance to suggest manufacturer-grounded setup changes for supported cars.",
  },
]

export function AiEngineer() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [inView, setInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Detect reduced-motion after mount (avoids hydration mismatch)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const reduce = mq.matches
    setReducedMotion(reduce)
    if (!reduce) {
      videoRef.current?.play().catch(() => {})
    }
  }, [])

  // Scroll-triggered reveal — fires once when panel first enters viewport
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Message reveal — gated on inView; reduced-motion shows all immediately
  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setVisibleMessages(chatMessages.length)
      return
    }
    if (visibleMessages >= chatMessages.length) return

    const prevDelay = visibleMessages > 0 ? chatMessages[visibleMessages - 1].delay : 0
    const nextDelay = chatMessages[visibleMessages].delay - prevDelay

    const timeout = setTimeout(() => {
      setVisibleMessages((v) => v + 1)
    }, visibleMessages === 0 ? 800 : nextDelay)

    return () => clearTimeout(timeout)
  }, [inView, visibleMessages, reducedMotion])

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
              NOT A COACH —
              <br />
              <span className="text-primary">YOUR RACE ENGINEER.</span>
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            RaceCortex isn&apos;t another AI driving coach — we&apos;ll leave the lap-by-lap tuition to the instructors. Clive is your race engineer: he feeds you the right information the moment you need it, answers when you ask, runs your fuel and tyre strategy, and reads the race in real time. No overlays to scan, no hotkeys to hunt for mid-corner — just talk to him and keep your eyes on the track.
          </p>
        </div>

        {/* Main showcase: video + comms log */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-0">
          {/* Left - Abstract loop video */}
          <div className="relative overflow-hidden rounded-sm border border-border lg:rounded-r-none">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <video
                ref={videoRef}
                src="/video/ai-engineer-loop.mp4"
                muted
                loop={!reducedMotion}
                playsInline
                preload="metadata"
                aria-label="Abstract motion graphic"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <Brain size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-foreground">Clive</span>
                    <p className="text-xs text-muted-foreground">Your personal race engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Team radio comms log */}
          <div ref={panelRef} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card lg:rounded-l-none lg:border-l-0">
            {/* Radio header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Radio size={13} className="text-primary" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  Team Radio
                </span>
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-[2px]">
                  {[4, 6, 9, 7, 5].map((h, i) => (
                    <div key={i} className="w-1 rounded-sm bg-primary/50" style={{ height: `${h}px` }} />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">SPA · LAP 14</span>
              </div>
            </div>

            {/* Comms log */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-5">
              {chatMessages.slice(0, visibleMessages).map((msg, i) =>
                msg.role === "engineer" ? (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 rounded-sm border border-primary/15 bg-primary/5 px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex items-center gap-1.5">
                      <Volume2 size={11} className="text-primary" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                        Clive
                      </span>
                    </div>
                    <p className="font-mono text-sm leading-relaxed text-foreground">
                      {msg.text}
                    </p>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex items-center gap-1.5">
                      <Mic size={11} className="text-muted-foreground/50" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                        You
                      </span>
                    </div>
                    <p className="font-mono text-sm leading-relaxed text-foreground/75">
                      {msg.text}
                    </p>
                  </div>
                )
              )}

              {inView && visibleMessages < chatMessages.length && (
                <div className="flex items-center gap-2 rounded-sm border border-primary/15 bg-primary/5 px-4 py-3">
                  <Volume2 size={11} className="text-primary" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">Clive</span>
                  <div className="ml-1 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Push-to-talk bar */}
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-end gap-[2px] opacity-20">
                  {[4, 7, 10, 8, 13, 6, 9, 11, 7, 4].map((h, i) => (
                    <div key={i} className="w-[3px] rounded-full bg-foreground" style={{ height: `${h}px` }} />
                  ))}
                </div>
                <button
                  disabled
                  aria-label="Push to talk — voice comms are live in the app"
                  className="flex h-10 w-10 shrink-0 cursor-default items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary"
                >
                  <Mic size={16} />
                </button>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/40">
                  Hold to Talk
                </span>
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

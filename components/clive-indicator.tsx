"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, Volume2 } from "lucide-react"

type Phase = "idle" | "listening" | "speaking"

const BAR_OPACITIES = [0.6, 0.75, 1.0, 0.75, 0.6]
const BAR_DURATIONS = [220, 280, 180, 320, 250]
const BAR_OFFSETS   = [0, 80, 40, 160, 120]

const MIN_H         = 6
const LISTEN_MAX_H  = 26
const SPEAK_MAX_H   = 44
const LISTEN_PERIOD = 1200

// Flip to true once a real Clive voice sample exists at public/audio/clive-sample.mp3
const HAS_CLIVE_SAMPLE = false

const CALLOUTS = [
  "Box this lap — fuel's two short.",
  "Car behind into Turn 3 — defend the inside.",
  "Two tenths up on your best — sector two's strong.",
  "Yellow in sector one — ease off, hold position.",
]

export function CliveIndicator() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [phase, setPhase] = useState<Phase>("idle")
  const [calloutIndex, setCalloutIndex] = useState(0)
  const [showCallout, setShowCallout] = useState(false)
  const [revealedChars, setRevealedChars] = useState(0)

  const barRefs      = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])
  const rafRef       = useRef<number | null>(null)
  const phaseRef     = useRef<Phase>("idle")
  const phaseStartRef = useRef<number>(0)

  // Detect reduced-motion after mount (avoids hydration mismatch)
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  // Sync refs whenever phase state changes
  useEffect(() => {
    phaseRef.current = phase
    phaseStartRef.current = performance.now()
    setShowCallout(phase === "speaking")
  }, [phase])

  // Static pose for reduced-motion users
  useEffect(() => {
    if (!reducedMotion) return
    setPhase("speaking")
    setCalloutIndex(0)
    barRefs.current.forEach((bar, i) => {
      if (!bar) return
      bar.style.height = `${Math.round(MIN_H + (SPEAK_MAX_H - MIN_H) * 0.65)}px`
      bar.style.backgroundColor = `rgba(255,77,0,${BAR_OPACITIES[i]})`
    })
  }, [reducedMotion])

  // Phase cycling: idle → listening → speaking → repeat
  useEffect(() => {
    if (reducedMotion) return

    let mounted = true
    let tid: ReturnType<typeof setTimeout>
    let idx = 0

    function tick() {
      if (!mounted) return
      setPhase("idle")
      tid = setTimeout(() => {
        if (!mounted) return
        setPhase("listening")
        tid = setTimeout(() => {
          if (!mounted) return
          setCalloutIndex(idx)
          setPhase("speaking")
          tid = setTimeout(() => {
            idx = (idx + 1) % CALLOUTS.length
            tick()
          }, 3500)
        }, 1400)
      }, 900)
    }

    tick()
    return () => { mounted = false; clearTimeout(tid) }
  }, [reducedMotion])

  // Character-by-character callout reveal
  useEffect(() => {
    if (reducedMotion) {
      setRevealedChars(CALLOUTS[calloutIndex].length)
      return
    }
    if (!showCallout) {
      setRevealedChars(0)
      return
    }
    const text = CALLOUTS[calloutIndex]
    let count = 0
    const ms = Math.max(Math.round(550 / text.length), 14)
    const timer = setInterval(() => {
      count++
      setRevealedChars(count)
      if (count >= text.length) clearInterval(timer)
    }, ms)
    return () => clearInterval(timer)
  }, [showCallout, calloutIndex, reducedMotion])

  // rAF bar animation — reads refs so re-registration is not needed per frame
  useEffect(() => {
    if (reducedMotion) return

    function animate(ts: number) {
      const p       = phaseRef.current
      const elapsed = ts - phaseStartRef.current

      barRefs.current.forEach((bar, i) => {
        if (!bar) return
        let h: number
        let color: string

        if (p === "idle") {
          h     = MIN_H
          color = "rgba(244,244,242,0.12)"
        } else if (p === "listening") {
          const t = (elapsed % LISTEN_PERIOD) / LISTEN_PERIOD
          h     = MIN_H + ((Math.sin(t * 2 * Math.PI) + 1) / 2) * (LISTEN_MAX_H - MIN_H)
          color = "rgba(255,77,0,0.4)"
        } else {
          const rawT  = Math.max(0, elapsed - BAR_OFFSETS[i])
          const barT  = (rawT % BAR_DURATIONS[i]) / BAR_DURATIONS[i]
          const eased = (Math.sin((barT - 0.25) * 2 * Math.PI) + 1) / 2
          h     = MIN_H + eased * (SPEAK_MAX_H - MIN_H)
          color = `rgba(255,77,0,${BAR_OPACITIES[i]})`
        }

        bar.style.height          = `${h}px`
        bar.style.backgroundColor = color
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    }
  }, [reducedMotion])

  // Derived pill appearance
  const pillBorder =
    phase === "speaking"  ? "1px solid rgba(255,77,0,0.50)" :
    phase === "listening" ? "1px solid rgba(255,77,0,0.25)" :
                            "1px solid rgba(255,77,0,0.08)"

  const pillShadow =
    phase === "speaking"  ? "0 0 28px rgba(255,77,0,0.28), 0 0 10px rgba(255,77,0,0.16)" :
    phase === "listening" ? "0 0 16px rgba(255,77,0,0.14)" :
                            "none"

  const labelColor =
    phase === "idle" ? "rgba(244,244,242,0.35)" : "#FF4D00"

  const text    = CALLOUTS[calloutIndex]
  const visible = text.slice(0, revealedChars)
  const typing  = !reducedMotion && revealedChars < text.length

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Screen-reader label for the whole block */}
      <span className="sr-only">Clive AI race engineer — real-time voice coaching demo</span>

      {/* Animated pill — decorative, hidden from AT */}
      <div
        aria-hidden="true"
        style={{
          display:           "inline-flex",
          alignItems:        "center",
          gap:               "10px",
          padding:           "10px 16px",
          borderRadius:      "8px",
          background:        "rgba(12,12,14,0.82)",
          border:            pillBorder,
          boxShadow:         pillShadow,
          backdropFilter:    "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition:        "border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Mic / Speaker icon */}
        <div
          style={{
            width: 16, height: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: phase === "idle" ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {phase === "listening"
            ? <Mic size={16} color="#FF4D00" />
            : <Volume2 size={16} color="#FF4D00" />}
        </div>

        {/* CLIVE wordmark */}
        <span
          style={{
            fontFamily:    "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize:      "11px",
            fontWeight:    600,
            letterSpacing: "0.12em",
            color:         labelColor,
            transition:    "color 0.3s ease",
            userSelect:    "none",
          }}
        >
          CLIVE
        </span>

        {/* EQ bars container — fixed height so bars grow upward from center */}
        <div style={{ display: "flex", alignItems: "center", gap: "3px", height: `${SPEAK_MAX_H}px` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              ref={(el) => { barRefs.current[i] = el }}
              style={{
                width:           "4px",
                height:          `${MIN_H}px`,
                borderRadius:    "2px",
                backgroundColor: "rgba(244,244,242,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Callout transcript line */}
      <div
        style={{
          minHeight:  "24px",
          display:    "flex",
          alignItems: "center",
          gap:        "8px",
          opacity:    showCallout ? 1 : 0,
          transition: reducedMotion ? "none" : "opacity 0.35s ease",
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize:      "10px",
            fontWeight:    600,
            letterSpacing: "0.1em",
            color:         "#FF4D00",
            flexShrink:    0,
          }}
        >
          CLIVE
        </span>
        <span
          style={{
            fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
            fontSize:   "13px",
            color:      "rgba(244,244,242,0.88)",
          }}
        >
          {visible}
          {typing && <span style={{ opacity: 0.45 }}>▋</span>}
        </span>
      </div>

      {/* Hear Clive — user-initiated audio only; gated until sample exists */}
      {HAS_CLIVE_SAMPLE && (
        <button
          onClick={() => { new Audio("/audio/clive-sample.mp3").play().catch(() => {}) }}
          aria-label="Play a sample of Clive speaking"
          className="mt-1 font-mono text-[11px] tracking-wider text-muted-foreground/50 transition-colors hover:text-primary"
        >
          ▶ HEAR CLIVE
        </button>
      )}
    </div>
  )
}

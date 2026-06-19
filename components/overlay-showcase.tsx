"use client"

import { useEffect, useRef, useState } from "react"

// ── Token vars scoped to .rc-showcase (won't clobber shadcn tokens) ───────────
const OVERLAY_CSS = `
.rc-showcase{
  --rc-ignition:#FF4D00;--rc-border:#26262B;--rc-chalk:#F4F4F2;
  --rc-smoke:#8A8C92;
  --rc-tel-gain:#00D26A;--rc-tel-loss:#FF3B30;
  --rc-tel-caution:#FFC400;--rc-tel-best:#B388FF;
  --rc-surface-widget:rgba(12,12,14,.82);
  --rc-surface-widget-header:rgba(26,26,31,.90);
  --rc-surface-player-row:rgba(255,77,0,.14);
  --rc-caution-soft:rgba(255,196,0,.12);
  --rc-radius-widget:6px;--rc-dur-base:200ms;
  --rc-ease:cubic-bezier(.4,0,.2,1);
  --rc-font-mono:var(--font-ibm-plex-mono),'IBM Plex Mono',monospace;
  --rc-font-ui:var(--font-inter),'Inter',system-ui,sans-serif;
}
@keyframes rc-clive-bar{from{transform:scaleY(.45)}to{transform:scaleY(1)}}
@media(prefers-reduced-motion:reduce){
  .rc-showcase [aria-label^="Clive is"] span{animation:none!important}
}
`

const MONO: React.CSSProperties = { fontFamily: "var(--rc-font-mono)", fontVariantNumeric: "tabular-nums" }

// ── Widget ─────────────────────────────────────────────────────────────────────
function Widget({ title, context, contextTone = "smoke", children, width }: {
  title?: string; context?: string; contextTone?: "smoke" | "accent"
  children?: React.ReactNode; width?: number | string
}) {
  return (
    <div style={{
      width, overflow: "hidden",
      background: "var(--rc-surface-widget)",
      border: "1px solid var(--rc-border)",
      borderRadius: "var(--rc-radius-widget)",
      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    }}>
      {(title || context) && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "7px 10px",
          background: "var(--rc-surface-widget-header)",
          borderBottom: "1px solid var(--rc-border)",
        }}>
          <span style={{ ...MONO, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rc-smoke)" }}>{title}</span>
          {context && (
            <span style={{ ...MONO, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.06em", color: contextTone === "accent" ? "var(--rc-ignition)" : "var(--rc-smoke)" }}>{context}</span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ── StandingsRow ───────────────────────────────────────────────────────────────
type GapTone = "gain" | "loss" | "best" | "neutral"
const GAP_COLOR: Record<GapTone, string> = {
  gain: "var(--rc-tel-gain)", loss: "var(--rc-tel-loss)",
  best: "var(--rc-tel-best)", neutral: "var(--rc-chalk)",
}

function SRow({ pos, num, driver, gap, tone = "neutral", isPlayer = false, inPit = false }: {
  pos: number | string; num: string; driver: string; gap: string
  tone?: GapTone; isPlayer?: boolean; inPit?: boolean
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, minHeight: 32,
      padding: isPlayer ? "0 10px 0 7px" : "0 10px",
      background: isPlayer ? "var(--rc-surface-player-row)" : "transparent",
      borderLeft: `3px solid ${isPlayer ? "var(--rc-ignition)" : "transparent"}`,
    }}>
      <span style={{ width: 22, textAlign: "right", ...MONO, fontSize: 13, fontWeight: 600, color: isPlayer ? "#fff" : "var(--rc-chalk)", flexShrink: 0 }}>{pos}</span>
      <span style={{ width: 24, textAlign: "center", ...MONO, fontSize: 10, color: "var(--rc-smoke)", flexShrink: 0 }}>{num}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--rc-font-ui)", fontSize: 12, fontWeight: isPlayer ? 600 : 500, color: isPlayer ? "#fff" : "var(--rc-chalk)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{driver}</span>
      {inPit && (
        <span style={{ ...MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", color: "var(--rc-tel-caution)", background: "var(--rc-caution-soft)", border: "1px solid rgba(255,196,0,.30)", borderRadius: 3, padding: "1px 4px", flexShrink: 0 }}>PIT</span>
      )}
      <span style={{ minWidth: 60, textAlign: "right", ...MONO, fontSize: 13, fontWeight: 600, color: isPlayer ? "#fff" : GAP_COLOR[tone], flexShrink: 0 }}>{gap}</span>
    </div>
  )
}

// ── CliveChip ──────────────────────────────────────────────────────────────────
const SPEAK_H = [10, 18, 24, 14, 8]

function CliveChip({ state = "idle", message, width }: {
  state?: "idle" | "listening" | "speaking"; message?: string; width?: number | string
}) {
  const active = state !== "idle"
  return (
    <div role="status" aria-label={`Clive is ${state}`} style={{
      display: "flex", alignItems: "center", gap: 10,
      width, minHeight: 48, padding: "0 14px",
      background: "var(--rc-surface-widget)",
      border: `1px solid ${active ? "rgba(255,77,0,.35)" : "var(--rc-border)"}`,
      borderRadius: "var(--rc-radius-widget)",
      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      transition: "border-color var(--rc-dur-base) var(--rc-ease)",
    }}>
      <span style={{ ...MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: active ? "var(--rc-ignition)" : "var(--rc-smoke)", transition: "color var(--rc-dur-base) var(--rc-ease)", flexShrink: 0 }}>CLIVE</span>
      {message && (
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--rc-font-ui)", fontSize: 12, color: "var(--rc-chalk)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{message}</span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28, marginLeft: message ? 0 : "auto", flexShrink: 0 }}>
        {SPEAK_H.map((h, i) => (
          <span key={i} style={{
            display: "block", width: 3, borderRadius: 9999,
            background: active ? "var(--rc-ignition)" : "var(--rc-border)",
            height: state === "speaking" ? h : state === "listening" ? 10 : 4,
            animation: active ? `rc-clive-bar 900ms var(--rc-ease) ${i * 90}ms infinite alternate` : "none",
            transition: "background var(--rc-dur-base) var(--rc-ease), height var(--rc-dur-base) var(--rc-ease)",
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtLap(s: number) {
  const m = Math.floor(s / 60)
  const rem = (s % 60).toFixed(3).padStart(6, "0")
  return `${m}:${rem}`
}

function tracePath(h: number, seed: number, t: number) {
  let d = `M0 ${h}`
  for (let x = 0; x <= 100; x += 5) {
    const y = h - Math.max(0, Math.min(h, (Math.sin(x / 8 + seed + t * 0.07) * 0.42 + 0.5) * h))
    d += ` L${x} ${y.toFixed(1)}`
  }
  return d
}

// ── Static data ────────────────────────────────────────────────────────────────
const CLIVE_MSGS = [
  "Box this lap — Aubry's pitting, we jump him.",
  "Two tenths up on your best — sector two's strong.",
  "Fuel's fine to the flag. Stay out, track position is ours.",
]

const ROWS = [
  { pos: 1,  num: "10", driver: "T. Bamber",       base: -1,     isPlayer: false, inPit: false },
  { pos: 2,  num: "25", driver: "F. Albuquerque",  base: 3.241,  isPlayer: false, inPit: false },
  { pos: 3,  num: "7",  driver: "M. Christensen",  base: 8.504,  isPlayer: false, inPit: true  },
  { pos: 8,  num: "37", driver: "W. Stevens",      base: 47.889, isPlayer: false, inPit: false },
  { pos: 9,  num: "64", driver: "YOU",             base: 53.410, isPlayer: true,  inPit: false },
  { pos: 10, num: "22", driver: "P. Hanson",       base: 61.022, isPlayer: false, inPit: false },
  { pos: 11, num: "44", driver: "G. Aubry",        base: 68.774, isPlayer: false, inPit: true  },
]

// Fuel cycles over FUEL_PERIOD ticks (12.4 → 8.5 L, then wraps) — never decays to zero.
const FUEL_PERIOD = 800
const FUEL_HI = 12.4
const FUEL_LO = 8.5
const FUEL_TARGET_LAPS = 4.1  // laps remaining to finish (fixed reference for "To finish")
const PER_LAP = 2.81

// ── StandingsWidget at module scope — stable component type, gaps passed as prop ─
function StandingsWidget({ gaps, width }: { gaps: string[]; width?: number | string }) {
  return (
    <Widget title="Standings" context="LAP 23/45" width={width}>
      {ROWS.map((r, i) => (
        <SRow key={r.pos} pos={r.pos} num={r.num} driver={r.driver}
          gap={gaps[i]} tone="neutral" isPlayer={r.isPlayer} inPit={r.inPit} />
      ))}
    </Widget>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function OverlayShowcase() {
  const wrapperRef   = useRef<HTMLDivElement>(null)  // IO visibility target
  const containerRef = useRef<HTMLDivElement>(null)  // ResizeObserver for scale
  const [scale, setScale]           = useState(1)
  const [tick, setTick]             = useState(0)
  const [rm, setRm]                 = useState(false)
  const [isVisible, setIsVisible]   = useState(false)
  const [cliveState, setCliveState] = useState<"idle" | "listening" | "speaking">("idle")
  const [cliveMsgIdx, setCliveMsgIdx] = useState(0)

  // Reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion:reduce)")
    setRm(mq.matches)
    const h = (e: MediaQueryListEvent) => setRm(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  // IntersectionObserver — start/stop animations based on viewport visibility
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // ResizeObserver → scale (desktop canvas only)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1280))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Telemetry tick — runs only while visible and not reduced-motion
  useEffect(() => {
    if (rm || !isVisible) return
    const id = setInterval(() => setTick(t => t + 1), 160)
    return () => clearInterval(id)
  }, [rm, isVisible])

  // Clive phase cycle — gated on visibility; resets to idle on leave
  useEffect(() => {
    if (rm) { setCliveState("speaking"); setCliveMsgIdx(0); return }
    if (!isVisible) { setCliveState("idle"); return }

    let alive = true, idx = 0
    let t: ReturnType<typeof setTimeout>
    function cycle() {
      if (!alive) return
      setCliveState("idle")
      t = setTimeout(() => {
        if (!alive) return
        setCliveState("listening")
        t = setTimeout(() => {
          if (!alive) return
          setCliveState("speaking"); setCliveMsgIdx(idx)
          t = setTimeout(() => { idx = (idx + 1) % CLIVE_MSGS.length; cycle() }, 4500)
        }, 1000)
      }, 1400)
    }
    cycle()
    return () => { alive = false; clearTimeout(t) }
  }, [rm, isVisible])

  // ── Derived telemetry ────────────────────────────────────────────────────────
  const deltaVal   = parseFloat((-0.05 + 0.5 * Math.sin(tick * 0.10)).toFixed(3))
  const ahead      = deltaVal <= 0
  const deltaColor = ahead ? "var(--rc-tel-gain)" : "var(--rc-tel-loss)"
  const barFill    = Math.min(Math.abs(deltaVal) / 0.6, 1) * 50
  const curLap     = fmtLap(91.793 + deltaVal * 0.6)
  const lastLap    = fmtLap(92.135 + Math.sin(tick * 0.03) * 0.05)

  // Fuel: cyclic sawtooth — 12.4 → 8.5 L over FUEL_PERIOD ticks, then wraps
  const fuelPhase = (tick % FUEL_PERIOD) / FUEL_PERIOD
  const fuelRem   = FUEL_HI - (FUEL_HI - FUEL_LO) * fuelPhase + Math.sin(tick * 0.04) * 0.12
  const lapsLeft  = fuelRem / PER_LAP
  const toFinish  = FUEL_TARGET_LAPS * PER_LAP - fuelRem  // positive = short (needs pit)
  const pitWindow = toFinish > 0

  const thrPct = Math.round(55 + 35 * ((Math.sin(tick * 0.28) + 1) / 2))
  const brkPct = Math.round(Math.max(0, 45 * -Math.sin(tick * 0.28)))

  const relBefore = (+ (-2.4 + Math.sin(tick * 0.07) * 0.4)).toFixed(1)
  const relAfter  = (+ (1.8  + Math.sin(tick * 0.11 + 1.2) * 0.5)).toFixed(1)

  const rowGaps = ROWS.map((r, i) => {
    if (r.base < 0) return "LEADER"
    if (r.isPlayer) return "+" + r.base.toFixed(3)
    return "+" + (r.base + Math.sin(tick * 0.04 + i * 1.1) * 0.25).toFixed(3)
  })

  // ── Full 1280×720 scene (desktop) ─────────────────────────────────────────────
  const scene = (
    <>
      {/* Standings — top left */}
      <div style={{ position: "absolute", left: 40, top: 40 }}>
        <StandingsWidget gaps={rowGaps} width={300} />
      </div>

      {/* Delta — top right */}
      <div style={{ position: "absolute", right: 40, top: 40 }}>
        <Widget title="Session best" context={fmtLap(91.451)} width={236}>
          <div style={{ padding: "12px 16px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ ...MONO, fontSize: 10, color: "var(--rc-smoke)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Current</span>
              <span style={{ ...MONO, fontSize: 28, fontWeight: 500, color: "var(--rc-chalk)", letterSpacing: "-0.5px" }}>{curLap}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ ...MONO, fontSize: 10, color: "var(--rc-smoke)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Last</span>
              <span style={{ ...MONO, fontSize: 14, color: "var(--rc-smoke)" }}>{lastLap}</span>
            </div>
            <div style={{ position: "relative", height: 8, background: "rgba(244,244,242,.07)", borderRadius: 9999, marginBottom: 10 }}>
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                [ahead ? "left" : "right"]: "50%",
                width: barFill + "%", background: deltaColor, borderRadius: 9999,
              }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "calc(50% - 0.5px)", width: 1, background: "rgba(244,244,242,.35)" }} />
            </div>
            <div style={{ textAlign: "center", ...MONO, fontSize: 24, fontWeight: 600, color: deltaColor }}>
              {ahead ? "" : "+"}{deltaVal.toFixed(3)}<span style={{ fontSize: 11, color: "var(--rc-smoke)", marginLeft: 2 }}>s</span>
            </div>
          </div>
        </Widget>
      </div>

      {/* Fuel — right, below Delta */}
      <div style={{ position: "absolute", right: 40, top: 230 }}>
        <Widget title="Fuel" context={pitWindow ? "PIT WINDOW" : undefined} contextTone={pitWindow ? "accent" : "smoke"} width={200}>
          <div style={{ padding: "6px 0" }}>
            {([
              ["Remaining", `${fuelRem.toFixed(1)} L`,                                             "chalk"],
              ["Per lap",   `${PER_LAP} L`,                                                        "chalk"],
              ["Laps left", lapsLeft.toFixed(1),                                                   "caution"],
              ["To finish", (toFinish > 0 ? "+" : "") + toFinish.toFixed(1) + " L", toFinish > 0 ? "loss" : "gain"],
            ] as [string, string, string][]).map(([l, v, t]) => {
              const c = ({ chalk: "var(--rc-chalk)", caution: "var(--rc-tel-caution)", loss: "var(--rc-tel-loss)", gain: "var(--rc-tel-gain)" } as Record<string, string>)[t] ?? "var(--rc-chalk)"
              return (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px" }}>
                  <span style={{ ...MONO, fontSize: 10, color: "var(--rc-smoke)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{l}</span>
                  <span style={{ ...MONO, fontSize: 15, fontWeight: 500, color: c }}>{v}</span>
                </div>
              )
            })}
          </div>
        </Widget>
      </div>

      {/* Relative — bottom left */}
      <div style={{ position: "absolute", left: 40, bottom: 120 }}>
        <Widget title="Relative" context="P9" width={272}>
          <SRow pos="P8"  num="37" driver="W. Stevens" gap={relBefore}        tone="gain" />
          <SRow pos="P9"  num="64" driver="YOU"        gap="0.0"              isPlayer />
          <SRow pos="P10" num="22" driver="P. Hanson"  gap={`+${relAfter}`}  tone="loss" />
        </Widget>
      </div>

      {/* Inputs — bottom right */}
      <div style={{ position: "absolute", right: 40, bottom: 120 }}>
        <Widget title="Inputs" width={200}>
          <div style={{ padding: "10px 12px" }}>
            <svg viewBox="0 0 100 44" width="100%" height={56} preserveAspectRatio="none">
              <path d={tracePath(44, 0,   tick)} fill="none" stroke="var(--rc-tel-gain)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path d={tracePath(44, 2.4, tick)} fill="none" stroke="var(--rc-tel-loss)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
              <span style={{ ...MONO, fontSize: 10, color: "var(--rc-tel-gain)" }}>● THR {thrPct}%</span>
              <span style={{ ...MONO, fontSize: 10, color: "var(--rc-tel-loss)" }}>● BRK {brkPct}%</span>
            </div>
          </div>
        </Widget>
      </div>

      {/* CliveChip — bottom center */}
      <div style={{ position: "absolute", left: "50%", bottom: 40, transform: "translateX(-50%)" }}>
        <CliveChip state={cliveState} message={cliveState === "speaking" ? CLIVE_MSGS[cliveMsgIdx] : undefined} width={420} />
      </div>
    </>
  )

  return (
    <div ref={wrapperRef} className="rc-showcase">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: OVERLAY_CSS }} />

      {/* Static description for screen readers — outside the aria-hidden stage */}
      <span className="sr-only">
        Live preview of the RaceCortex in-sim overlay: standings, delta, fuel strategy, relative gaps, inputs trace, and Clive&apos;s voice comms.
      </span>

      {/* ── Desktop: full scaled scene ── */}
      <div
        ref={containerRef}
        className="relative hidden overflow-hidden rounded-sm border border-border md:block"
        style={{ aspectRatio: "16/9" }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, left: 0,
            width: 1280, height: 720,
            background: "#070709",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {scene}
        </div>
      </div>

      {/* ── Mobile: Standings + Clive at native size ── */}
      <div
        aria-hidden="true"
        className="flex flex-col gap-3 overflow-hidden rounded-sm border border-border p-4 md:hidden"
        style={{ background: "#070709" }}
      >
        <StandingsWidget gaps={rowGaps} />
        <CliveChip state={cliveState} message={cliveState === "speaking" ? CLIVE_MSGS[cliveMsgIdx] : undefined} width="100%" />
      </div>
    </div>
  )
}

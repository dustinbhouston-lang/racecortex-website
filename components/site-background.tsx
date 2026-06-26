'use client'

import { useEffect, useRef } from 'react'

interface Streak {
  x: number
  y: number
  length: number
  speed: number
  thickness: number
  peakOpacity: number
  colorType: 'orange' | 'blue' | 'white'
}

function makeStreak(canvasWidth: number, canvasHeight: number, startX?: number): Streak {
  const rand = Math.random()
  const colorType: Streak['colorType'] =
    rand < 0.45 ? 'orange' : rand < 0.80 ? 'blue' : 'white'

  return {
    x: startX ?? Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    length: 120 + Math.random() * 340,
    speed: 0.15 + Math.random() * 0.5,
    thickness: 0.6 + Math.random() * 1.6,
    peakOpacity: 0.05 + Math.random() * 0.22,
    colorType,
  }
}

function colorFor(type: Streak['colorType']): string {
  if (type === 'orange') return '255,77,0'
  if (type === 'blue') return '60,140,255'
  return '244,244,242'
}

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const streaksRef = useRef<Streak[]>([])
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function setup() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.round(window.innerWidth / 60)
      streaksRef.current = Array.from({ length: count }, () =>
        makeStreak(canvas.width, canvas.height)
      )
    }

    // Render one frame. When `advance` is false the streaks are painted in place
    // (used for the reduced-motion static pose and resize redraws).
    function paint(advance: boolean) {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of streaksRef.current) {
        const rgb = colorFor(s.colorType)
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y)
        grad.addColorStop(0, `rgba(${rgb},0)`)
        grad.addColorStop(0.5, `rgba(${rgb},${s.peakOpacity})`)
        grad.addColorStop(1, `rgba(${rgb},0)`)

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + s.length, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = s.thickness
        ctx.stroke()

        if (advance) {
          s.x += s.speed
          if (s.x > canvas.width) {
            const next = makeStreak(canvas.width, canvas.height, -s.length)
            Object.assign(s, next)
          }
        }
      }
    }

    function loop() {
      paint(true)
      rafRef.current = requestAnimationFrame(loop)
    }

    function start() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }

    setup()

    if (reducedMotion) {
      // Static single frame — no rAF loop to burn CPU behind every page.
      paint(false)
    } else {
      start()
    }

    const onResize = () => {
      setup()
      // Repaint one frame immediately so a resize while paused (reduced-motion
      // or hidden tab) isn't left blank; the running loop overwrites it next frame.
      paint(false)
    }
    window.addEventListener('resize', onResize)

    // Pause the loop while the tab is hidden; resume on return.
    const onVisibility = () => {
      if (reducedMotion) return
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else {
        start()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor: '#0C0C0E' }}
    >
      {/* Orange ember glow */}
      <div
        className="absolute inset-0 site-bg-ember-orange"
        style={{
          background: `
            radial-gradient(58% 52% at 80% 6%, rgba(255,77,0,0.34), transparent 58%),
            radial-gradient(50% 46% at 45% 55%, rgba(255,77,0,0.14), transparent 62%)
          `,
        }}
      />

      {/* Blue ember glow */}
      <div
        className="absolute inset-0 site-bg-ember-blue"
        style={{
          background: `
            radial-gradient(56% 50% at 14% 94%, rgba(60,140,255,0.30), transparent 60%),
            radial-gradient(46% 44% at 92% 78%, rgba(60,140,255,0.18), transparent 60%)
          `,
        }}
      />

      {/* Speed streaks canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(100% 70% at 50% 120%, rgba(0,0,0,0.55), transparent 60%)',
        }}
      />
    </div>
  )
}

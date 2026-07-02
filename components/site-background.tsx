'use client'
import { useEffect, useState } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'

export function SiteBackground() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor: '#0C0C0E' }}
    >
      <MeshGradient
        colors={['#f3f3f1', '#ff4d00', '#a1c4e8', '#0c0c0e']}
        distortion={0.81}
        swirl={0.1}
        grainMixer={0.15}
        grainOverlay={0.07}
        speed={reduced ? 0 : 0.3}
        scale={1}
        rotation={0}
        offsetX={0}
        offsetY={0}
        style={{ width: '100%', height: '100%' }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(12,12,14,0.4)' }}
      />
    </div>
  )
}

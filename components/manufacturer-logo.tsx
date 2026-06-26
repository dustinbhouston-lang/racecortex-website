import React from 'react'

interface ManufacturerLogoProps {
  manufacturer: string
  size?: number
}

// Self-contained inline SVGs — no external requests, no third-party CDN.
// These are the same stylized placeholder marks used by the RaceCortex
// in-app overlay (kept consistent across product + landing). They are
// simplified placeholders, NOT official brand artwork. To upgrade later,
// drop official monochrome SVGs into /public/manufacturers/ and load those
// locally — never hotlink an external repo.
export function ManufacturerLogo({ manufacturer, size = 18 }: ManufacturerLogoProps) {
  const s = size

  switch (manufacturer.toLowerCase()) {
    case 'cadillac':
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none" aria-label="Cadillac">
          <rect x="2" y="3" width="14" height="12" rx="1" fill="#2A3A8A" />
          <rect x="3" y="4" width="12" height="10" rx="0.5" fill="#B8C4E8" />
          <rect x="4" y="5" width="4" height="3" fill="#BF0A2E" />
          <rect x="10" y="5" width="4" height="3" fill="#BF0A2E" />
          <rect x="4" y="9" width="4" height="3" fill="#BF0A2E" />
          <rect x="10" y="9" width="4" height="3" fill="#BF0A2E" />
          <rect x="8" y="4" width="2" height="10" fill="#D4A72C" />
          <rect x="3" y="8" width="12" height="2" fill="#D4A72C" />
        </svg>
      )

    case 'bmw':
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none" aria-label="BMW">
          <circle cx="9" cy="9" r="8" fill="#1C1C1C" />
          <circle cx="9" cy="9" r="7" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M9 2 A7 7 0 0 1 16 9 L9 9 Z" fill="#FFFFFF" />
          <path d="M9 9 L16 9 A7 7 0 0 1 9 16 Z" fill="#0066CC" />
          <path d="M2 9 A7 7 0 0 1 9 2 L9 9 Z" fill="#0066CC" />
          <path d="M9 16 A7 7 0 0 1 2 9 L9 9 Z" fill="#FFFFFF" />
          <circle cx="9" cy="9" r="3" fill="#1C1C1C" />
          <circle cx="9" cy="9" r="2.5" fill="none" stroke="#FFFFFF" strokeWidth="0.4" />
        </svg>
      )

    case 'porsche':
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none" aria-label="Porsche">
          <rect x="2" y="2" width="14" height="14" rx="2" fill="#0A0A0A" stroke="#C8A84B" strokeWidth="0.8" />
          <path d="M9 4 C8 4.5 7 5.5 7 7 L8 8 L7.5 11 L8.5 11 L9 8.5 L9.5 11 L10.5 11 L10 8 L11 7 C11 5.5 10 4.5 9 4Z" fill="#C8A84B" />
          <rect x="3" y="13" width="3" height="1.5" fill="#C8A84B" />
          <rect x="12" y="13" width="3" height="1.5" fill="#C8A84B" />
        </svg>
      )

    case 'ferrari':
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none" aria-label="Ferrari">
          <path d="M9 1 L16 4 L16 14 Q9 18 9 18 Q9 18 2 14 L2 4 Z" fill="#FFCC00" />
          <path d="M9 5 C8 5.5 7.5 6.5 7.5 7.5 L8 8.5 L7.5 12 L8.5 12 L9 9 L9.5 12 L10.5 12 L10 8.5 L10.5 7.5 C10.5 6.5 10 5.5 9 5Z" fill="#000000" />
          <rect x="3.5" y="3" width="11" height="1.5" fill="#007A3D" />
        </svg>
      )

    case 'chevrolet':
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none" aria-label="Chevrolet">
          <rect x="1" y="7" width="16" height="4" fill="#D4A72C" />
          <rect x="6" y="7" width="6" height="4" fill="#0C0C0E" />
          <polygon points="1,7 6,7 6,11 1,11" fill="#D4A72C" />
          <polygon points="12,7 17,7 17,11 12,11" fill="#D4A72C" />
          <rect x="1" y="8.5" width="16" height="1" fill="#B8920A" />
        </svg>
      )

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none" aria-label={manufacturer}>
          <rect x="2" y="2" width="14" height="14" rx="2" fill="#26262B" />
          <text x="9" y="12" textAnchor="middle" fontSize="7" fill="#8A8C92" fontFamily="monospace">
            {manufacturer.slice(0, 2).toUpperCase()}
          </text>
        </svg>
      )
  }
}

import React from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type LicenseClass = 'R' | 'D' | 'C' | 'B' | 'A' | 'P'
export type RowState = 'pit' | 'outlap' | 'lapping' | null

export interface RelativeRow {
  pos: string
  driver: string
  manufacturer: string
  license: LicenseClass
  sr: string
  irating: string
  classColor: string
  gap: string
  isPlayer: boolean
  state: RowState
}

export type SessionType = 'race' | 'qualify' | 'practice'

export interface RelativeWidgetProps {
  sof: number
  incidents: string
  sessionType: SessionType
  timeRemaining: string
  currentLap: number
  estTotal: number
  rows: RelativeRow[]
}

// ─── Session badge ────────────────────────────────────────────────────────────

function SessionBadge({ type }: { type: SessionType }) {
  const map = {
    race:     { label: 'RACE',     color: '#00D26A' },
    qualify:  { label: 'QUALIFY',  color: '#FFC400' },
    practice: { label: 'PRACTICE', color: '#8A8C92' },
  }
  const { label, color } = map[type]
  return (
    <span
      className="inline-flex items-center px-[5px] py-[1px] rounded-[3px] border border-[#26262B]"
      style={{
        fontSize: '9px',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.14em',
        color,
        background: `${color}18`,
      }}
    >
      {label}
    </span>
  )
}

// ─── License badge ────────────────────────────────────────────────────────────

const LICENSE_COLORS: Record<LicenseClass, { bg: string; text: string }> = {
  P: { bg: 'rgba(0,255,255,0.14)',   text: '#00D8D8' },
  A: { bg: 'rgba(0,102,204,0.20)',   text: '#4DA6FF' },
  B: { bg: 'rgba(0,180,80,0.20)',    text: '#00D26A' },
  C: { bg: 'rgba(255,196,0,0.18)',   text: '#FFC400' },
  D: { bg: 'rgba(255,80,30,0.20)',   text: '#FF6030' },
  R: { bg: 'rgba(255,59,48,0.22)',   text: '#FF3B30' },
}

function LicenseBadge({ license }: { license: LicenseClass }) {
  const { bg, text } = LICENSE_COLORS[license] ?? LICENSE_COLORS['R']
  return (
    <span
      className="inline-flex items-center justify-center rounded-[3px] border border-[#26262B]"
      style={{
        width: '14px',
        height: '14px',
        fontSize: '8px',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.04em',
        background: bg,
        color: text,
        flexShrink: 0,
      }}
    >
      {license}
    </span>
  )
}

// ─── Pit/state badge ──────────────────────────────────────────────────────────

function StateBadge({ state }: { state: RowState }) {
  if (!state) return null
  const map: Record<NonNullable<RowState>, { label: string; color: string }> = {
    pit:     { label: 'PIT',    color: '#FFC400' },
    outlap:  { label: 'OUT',    color: '#FFC400' },
    lapping: { label: '+1L',    color: '#00D26A' },
  }
  const { label, color } = map[state]
  return (
    <span
      className="inline-flex items-center px-[3px] py-[1px] rounded-[3px] border"
      style={{
        fontSize: '8px',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.14em',
        color,
        borderColor: `${color}40`,
        background: `${color}12`,
      }}
    >
      {label}
    </span>
  )
}

// ─── Single row ───────────────────────────────────────────────────────────────

function RelativeRowItem({
  row,
  index,
}: {
  row: RelativeRow
  index: number
}) {
  const isEven = index % 2 === 0
  const rowBg = row.isPlayer
    ? 'rgba(255,77,0,0.14)'
    : isEven
    ? 'transparent'
    : 'rgba(244,244,242,0.02)'

  // Gap colour logic
  const isGapDash = row.gap === '—' || row.gap === '-'
  const isLapping = row.state === 'lapping'
  // Negative gap = ahead of player
  const isAhead = !isGapDash && row.gap.startsWith('-')
  const isBehind = !isGapDash && row.gap.startsWith('+')

  let gapColor = '#F4F4F2'
  if (isGapDash) gapColor = '#F4F4F2'
  else if (isLapping && isAhead) gapColor = '#00D26A'
  else if (row.state === 'pit') gapColor = '#FFC400'
  else if (isAhead) gapColor = '#8A8C92'
  else if (isBehind) gapColor = '#8A8C92'

  return (
    <div
      className="relative flex items-center border-b border-[#26262B] last:border-b-0"
      style={{ background: rowBg, minHeight: '28px' }}
    >
      {/* Left class colour bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: row.isPlayer ? '3px' : '4px',
          background: row.isPlayer ? '#FF4D00' : row.classColor,
          opacity: row.isPlayer ? 1 : 0.5,
        }}
      />

      {/* Position */}
      <div className="pl-[10px] pr-[4px] w-[32px] flex-shrink-0 text-right">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 500,
            color: row.isPlayer ? '#FF4D00' : '#8A8C92',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.pos}
        </span>
      </div>

      {/* Driver name */}
      <div className="flex-1 min-w-0 px-[6px]">
        <span
          className="block truncate"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: row.isPlayer ? 600 : 400,
            color: '#F4F4F2',
          }}
        >
          {row.driver}
        </span>
      </div>

      {/* License + state badge cluster */}
      <div className="flex items-center gap-[4px] pr-[6px] flex-shrink-0">
        <LicenseBadge license={row.license} />
        {row.state && <StateBadge state={row.state} />}
      </div>

      {/* Safety Rating */}
      <div className="w-[30px] flex-shrink-0 text-right pr-[6px]">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#8A8C92',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.sr}
        </span>
      </div>

      {/* iRating */}
      <div className="w-[36px] flex-shrink-0 text-right pr-[6px]">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#8A8C92',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.irating}
        </span>
      </div>

      {/* Gap */}
      <div className="w-[40px] flex-shrink-0 text-right pr-[8px]">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 500,
            color: row.isPlayer ? '#F4F4F2' : gapColor,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.gap}
        </span>
      </div>
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export function RelativeWidget({
  sof,
  incidents,
  sessionType,
  timeRemaining,
  currentLap,
  estTotal,
  rows,
}: RelativeWidgetProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[6px] border border-[#26262B]"
      style={{
        width: '340px',
        background: 'rgba(12,12,14,0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {/* Header row 1: SOF + incidents */}
      <div
        className="flex items-center justify-between px-3 py-[5px] border-b border-[#26262B]"
        style={{ background: 'rgba(26,26,31,0.90)' }}
      >
        <div className="flex items-center gap-[8px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            SOF
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#F4F4F2',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {sof.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            INC
          </span>
          <span
            className="inline-flex items-center px-[5px] py-[1px] rounded-[3px] border border-[#FF3B30]/40"
            style={{
              fontSize: '9.5px',
              fontFamily: 'var(--font-mono)',
              color: '#FF3B30',
              background: 'rgba(255,59,48,0.14)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {incidents}
          </span>
        </div>
      </div>

      {/* Header row 2: label + session badge */}
      <div
        className="flex items-center justify-between px-3 py-[5px] border-b border-[#26262B]"
        style={{ background: 'rgba(26,26,31,0.75)' }}
      >
        <div className="flex items-center gap-[8px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#F4F4F2',
            }}
          >
            RELATIVE
          </span>
          <SessionBadge type={sessionType} />
        </div>
      </div>

      {/* Column labels */}
      <div
        className="flex items-center border-b border-[#26262B] pl-[10px] pr-[8px] py-[3px]"
        style={{ background: 'rgba(26,26,31,0.50)' }}
      >
        {/* pos */}
        <div className="w-[32px] flex-shrink-0" />
        {/* driver */}
        <div className="flex-1 px-[6px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            DRIVER
          </span>
        </div>
        {/* lic/state */}
        <div className="pr-[6px] flex-shrink-0 w-[40px]" />
        {/* SR */}
        <div className="w-[30px] text-right pr-[6px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            SR
          </span>
        </div>
        {/* iR */}
        <div className="w-[36px] text-right pr-[6px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            iR
          </span>
        </div>
        {/* gap */}
        <div className="w-[40px] text-right">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            GAP
          </span>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <RelativeRowItem key={`${row.pos}-${row.driver}`} row={row} index={i} />
      ))}

      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-[6px] border-t border-[#26262B]"
        style={{ background: 'rgba(26,26,31,0.90)' }}
      >
        <div className="flex items-center gap-[4px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            TIME
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#F4F4F2',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {timeRemaining}
          </span>
        </div>
        <div className="flex items-center gap-[4px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            LAP
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#F4F4F2',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currentLap} / ~{estTotal}
          </span>
        </div>
      </div>
    </div>
  )
}

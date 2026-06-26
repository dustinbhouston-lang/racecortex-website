import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StandingsRow {
  pos: number
  num: string
  driver: string
  manufacturer: string
  bestLap: string
  isBest: boolean
  gap: string
  isPlayer: boolean
  onPit: boolean
}

export interface StandingsClass {
  name: string
  color: string
  rows: StandingsRow[]
}

export type SessionMode = 'race' | 'qualify' | 'practice'

export interface StandingsWidgetProps {
  title?: string
  sessionMode: SessionMode
  currentLap: number
  totalLaps: number
  classes: StandingsClass[]
}

// ─── Session badge ────────────────────────────────────────────────────────────

function SessionBadge({ mode }: { mode: SessionMode }) {
  const map = {
    race:     { label: 'RACE',     color: '#00D26A' },
    qualify:  { label: 'QUALIFY',  color: '#FFC400' },
    practice: { label: 'PRACTICE', color: '#8A8C92' },
  }
  const { label, color } = map[mode]
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

// ─── Pit badge ────────────────────────────────────────────────────────────────

function PitBadge() {
  return (
    <span
      className="inline-flex items-center px-[4px] py-[1px] rounded-[3px] border border-[#FFC400]/40"
      style={{
        fontSize: '8px',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.14em',
        color: '#FFC400',
        background: 'rgba(255,196,0,0.12)',
      }}
    >
      PIT
    </span>
  )
}

// ─── Class section header ─────────────────────────────────────────────────────

function ClassHeader({ cls }: { cls: StandingsClass }) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-[5px] border-b border-[#26262B]"
      style={{ background: 'rgba(26,26,31,0.60)' }}
    >
      {/* Class colour dot */}
      <span
        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
        style={{ background: cls.color }}
      />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          color: cls.color,
          textTransform: 'uppercase',
        }}
      >
        {cls.name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: '#8A8C92',
        }}
      >
        {cls.rows.length} CARS
      </span>
    </div>
  )
}

// ─── Single row ───────────────────────────────────────────────────────────────

function StandingsRow({
  row,
  classColor,
  index,
}: {
  row: StandingsRow
  classColor: string
  index: number
}) {
  const isEven = index % 2 === 0
  const rowBg = row.isPlayer
    ? 'rgba(255,77,0,0.14)'
    : isEven
    ? 'transparent'
    : 'rgba(244,244,242,0.02)'

  const gapColor =
    row.gap === 'LEADER'
      ? '#00D26A'
      : row.gap.startsWith('+') && row.gap.includes('L')
      ? '#FF3B30'
      : '#F4F4F2'

  return (
    <div
      className="relative flex items-center border-b border-[#26262B] last:border-b-0"
      style={{ background: rowBg, minHeight: '28px' }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: '3px',
          background: row.isPlayer ? '#FF4D00' : classColor,
          opacity: row.isPlayer ? 1 : 0.45,
        }}
      />

      {/* Position */}
      <div className="pl-[10px] pr-[6px] w-[28px] flex-shrink-0 text-right">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: 0,
            color: row.isPlayer ? '#FF4D00' : '#8A8C92',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.pos}
        </span>
      </div>

      {/* Car number */}
      <div className="pl-[4px] pr-[6px] w-[28px] flex-shrink-0">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#8A8C92',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          #{row.num}
        </span>
      </div>

      {/* Driver name */}
      <div className="flex-1 min-w-0 pr-2">
        <span
          className="block truncate"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: row.isPlayer ? 600 : 400,
            color: row.isPlayer ? '#F4F4F2' : '#F4F4F2',
          }}
        >
          {row.driver}
        </span>
      </div>

      {/* Best lap */}
      <div className="pr-[8px] flex-shrink-0 w-[58px] text-right">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: row.isBest ? '#B388FF' : '#8A8C92',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.bestLap}
        </span>
      </div>

      {/* Gap */}
      <div className="pr-[8px] flex-shrink-0 w-[52px] text-right">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            color: gapColor,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.gap}
        </span>
      </div>

      {/* Pit badge */}
      <div className="pr-[8px] flex-shrink-0 w-[30px] flex items-center justify-end">
        {row.onPit && <PitBadge />}
      </div>
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export function StandingsWidget({
  title = 'STANDINGS',
  sessionMode,
  currentLap,
  totalLaps,
  classes,
}: StandingsWidgetProps) {
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
      {/* Widget header */}
      <div
        className="flex items-center justify-between px-3 py-[7px] border-b border-[#26262B]"
        style={{ background: 'rgba(26,26,31,0.90)' }}
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
            {title}
          </span>
          <SessionBadge mode={sessionMode} />
        </div>
        <div className="flex items-center gap-[4px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '9px',
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
              fontSize: '10.5px',
              fontWeight: 500,
              color: '#F4F4F2',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currentLap} / {totalLaps}
          </span>
        </div>
      </div>

      {/* Column labels */}
      <div
        className="flex items-center border-b border-[#26262B] px-[10px] py-[3px]"
        style={{ background: 'rgba(26,26,31,0.50)' }}
      >
        {/* pos */}
        <div className="w-[28px] flex-shrink-0" />
        {/* num */}
        <div className="w-[28px] flex-shrink-0" />
        {/* driver */}
        <div className="flex-1" />
        {/* best lap label */}
        <div className="w-[58px] text-right pr-[8px]">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8.5px',
              letterSpacing: '0.14em',
              color: '#8A8C92',
              textTransform: 'uppercase',
            }}
          >
            BEST
          </span>
        </div>
        {/* gap label */}
        <div className="w-[52px] text-right pr-[8px]">
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
        {/* pit */}
        <div className="w-[30px]" />
      </div>

      {/* Classes */}
      {classes.map((cls) => (
        <div key={cls.name}>
          <ClassHeader cls={cls} />
          {cls.rows.map((row, i) => (
            <StandingsRow
              key={row.num}
              row={row}
              classColor={cls.color}
              index={i}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

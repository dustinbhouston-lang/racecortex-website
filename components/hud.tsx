'use client'

// HUD section — real StandingsWidget + RelativeWidget as static marketing mockups
import { StandingsWidget } from './standings-widget'
import { RelativeWidget } from './relative-widget'
import type { StandingsWidgetProps } from './standings-widget'
import type { RelativeWidgetProps } from './relative-widget'

// ─── Static mockup data ───────────────────────────────────────────────────────

const STANDINGS_DATA: StandingsWidgetProps = {
  title: 'STANDINGS',
  sessionMode: 'race',
  currentLap: 23,
  totalLaps: 45,
  classes: [
    {
      name: 'GTP',
      color: '#4DA6FF',
      rows: [
        { pos: 1,  num: '10', driver: 'BAMBER E.',    manufacturer: 'Cadillac',    bestLap: '1:42.318', isBest: false, gap: 'LEADER',  isPlayer: false, onPit: false },
        { pos: 2,  num: '31', driver: 'NASR F.',      manufacturer: 'Chevrolet',        bestLap: '1:42.501', isBest: false, gap: '+4.291',  isPlayer: false, onPit: false },
        { pos: 3,  num: '25', driver: 'YOU',          manufacturer: 'BMW',         bestLap: '1:42.190', isBest: true,  gap: '+6.814',  isPlayer: true,  onPit: false },
        { pos: 4,  num: '7',  driver: 'TAYLOR R.',    manufacturer: 'Porsche',     bestLap: '1:42.774', isBest: false, gap: '+7.532',  isPlayer: false, onPit: false },
        { pos: 5,  num: '4',  driver: 'BOURDAIS S.',  manufacturer: 'Ferrari', bestLap: '1:43.110', isBest: false, gap: '+12.047', isPlayer: false, onPit: true  },
      ],
    },
    {
      name: 'GT3',
      color: '#00D26A',
      rows: [
        { pos: 1,  num: '91', driver: 'LIETZ R.',     manufacturer: 'Ferrari', bestLap: '1:48.441', isBest: true,  gap: 'LEADER',  isPlayer: false, onPit: false },
        { pos: 2,  num: '62', driver: 'CALADO J.',    manufacturer: 'Ferrari',     bestLap: '1:48.702', isBest: false, gap: '+2.118',  isPlayer: false, onPit: false },
        { pos: 3,  num: '82', driver: 'TOMCZYK M.',   manufacturer: 'BMW',         bestLap: '1:49.003', isBest: false, gap: '+5.340',  isPlayer: false, onPit: true  },
        { pos: 4,  num: '23', driver: 'CHRISTODOULOU A.', manufacturer: 'Cadillac', bestLap: '1:49.201', isBest: false, gap: '+8.891', isPlayer: false, onPit: false },
        { pos: 5,  num: '78', driver: 'SIMS A.',      manufacturer: 'Porsche',     bestLap: '1:49.688', isBest: false, gap: '+1L',     isPlayer: false, onPit: false },
      ],
    },
  ],
}

const RELATIVE_DATA: RelativeWidgetProps = {
  sof: 3250,
  incidents: '2x',
  sessionType: 'race',
  timeRemaining: '38:14',
  currentLap: 23,
  estTotal: 45,
  rows: [
    {
      pos: 'P1',  driver: 'BAMBER E.',    manufacturer: 'Cadillac',    license: 'A', sr: '3.8', irating: '5.5k', classColor: '#4DA6FF', gap: '-6.8',  isPlayer: false, state: null,
    },
    {
      pos: 'P2',  driver: 'NASR F.',      manufacturer: 'Chevrolet',        license: 'A', sr: '4.2', irating: '4.8k', classColor: '#4DA6FF', gap: '-2.5',  isPlayer: false, state: null,
    },
    {
      pos: 'P3',  driver: 'YOU',          manufacturer: 'BMW',         license: 'B', sr: '3.1', irating: '3.2k', classColor: '#4DA6FF', gap: '—',     isPlayer: true,  state: null,
    },
    {
      pos: 'P4',  driver: 'TAYLOR R.',    manufacturer: 'Porsche',     license: 'A', sr: '4.5', irating: '5.1k', classColor: '#4DA6FF', gap: '+0.7',  isPlayer: false, state: null,
    },
    {
      pos: 'P5',  driver: 'BOURDAIS S.',  manufacturer: 'Ferrari', license: 'A', sr: '3.9', irating: '4.2k', classColor: '#4DA6FF', gap: '+5.3',  isPlayer: false, state: 'pit',
    },
    {
      pos: 'P1',  driver: 'LIETZ R.',     manufacturer: 'Ferrari', license: 'B', sr: '3.3', irating: '2.8k', classColor: '#00D26A', gap: '+1.2',  isPlayer: false, state: null,
    },
    {
      pos: 'P2',  driver: 'CALADO J.',    manufacturer: 'Ferrari',     license: 'C', sr: '2.7', irating: '1.9k', classColor: '#00D26A', gap: '+4.6',  isPlayer: false, state: null,
    },
  ],
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Hud() {
  return (
    <section
      id="hud"
      aria-labelledby="hud-heading"
      className="relative py-24 lg:py-32 border-t border-[#26262B] overflow-hidden"
    >
      {/* Faint ember right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 50% at 100% 50%, rgba(255,77,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* ── Widget mockup ── */}
          <div className="order-2 lg:order-1">
            {/* Race backdrop */}
            <div
              className="relative rounded-[10px] overflow-hidden border border-[#26262B]"
              style={{
                background:
                  'linear-gradient(160deg, #0d1117 0%, #0c0c0e 40%, #12100e 100%)',
                minHeight: '420px',
              }}
            >
              {/* Subtle track-lights ambience */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 40% at 50% 80%, rgba(255,77,0,0.07) 0%, transparent 70%)',
                }}
              />
              {/* Speed-line decoration */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(88deg, #F4F4F2 0px, #F4F4F2 1px, transparent 1px, transparent 120px)',
                }}
              />

              {/* Widgets — overlapped slightly */}
              <div className="relative p-5 flex flex-col gap-0 items-start">
                {/* Standings sits top-left */}
                <div
                  className="relative z-10 w-full max-w-[340px]"
                  style={{ transform: 'rotate(-0.5deg)' }}
                  aria-label="Standings widget mockup"
                >
                  <StandingsWidget {...STANDINGS_DATA} />
                </div>

                {/* Relative floats bottom-right, overlapping standings */}
                <div
                  className="relative z-20 self-end w-full max-w-[340px]"
                  style={{ marginTop: '-90px', transform: 'rotate(0.6deg)' }}
                  aria-label="Relative widget mockup"
                >
                  <RelativeWidget {...RELATIVE_DATA} />
                </div>
              </div>

              {/* "IGNITION OVERLAY" watermark badge */}
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00] ember-pulse" aria-hidden="true" />
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#5C5E66]">
                  Ignition Overlay · Static Preview
                </span>
              </div>
            </div>
          </div>

          {/* ── Copy ── */}
          <div className="order-1 lg:order-2">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF4D00]">
              Ignition Overlay
            </p>
            <h2
              id="hud-heading"
              className="font-display font-bold uppercase text-balance"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              Your Race Data.{' '}
              <span className="text-[#8A8C92]">Front and Center.</span>
            </h2>
            <p className="mt-4 mb-8 font-sans text-base leading-relaxed text-[#5C5E66]">
              The Ignition Overlay drops floating glass panels directly into your broadcast —
              multiclass standings, relative timing gaps, license, and iRating all readable at
              race speed. No alt-tab. No mental overhead. Just the data you need, exactly when
              you need it.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { title: 'Standings',    desc: 'Full multiclass order with best-lap highlights',                     color: '#FF4D00' },
                { title: 'Relative',     desc: 'License, iRating & gaps for every car around you',                   color: '#FF4D00' },
                { title: 'Pit Strategy', desc: 'Fuel load, tyre delta, and optimal stop windows',                    color: '#FF4D00' },
                { title: 'Full Suite',   desc: 'Delta, fuel, inputs, tyres and more — the full overlay suite, included.', color: '#FF4D00' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-[4px] border border-[#26262B] bg-[#1A1A1F] px-4 py-3"
                >
                  <span
                    className="mt-1 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: item.color }}>{item.title}</span>
                    <span className="font-sans text-sm text-[#8A8C92]">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

'use client'

interface PhaseArc {
  key: string
  start: number
  end: number
  color: string
}

const PHASE_ARCS: PhaseArc[] = [
  { key: 'menstrual', start: 0, end: 5 / 29, color: '#f43f5e' },
  { key: 'follicular', start: 5 / 29, end: 13 / 29, color: '#a855f7' },
  { key: 'ovulation', start: 13 / 29, end: 16 / 29, color: '#f0abfc' },
  { key: 'luteal', start: 16 / 29, end: 1, color: '#fb923c' },
]

interface Props {
  day: number
  totalDays?: number
  color: string
  size?: number
}

export default function CycleRing({ day, totalDays = 29, color, size = 260 }: Props) {
  const r = size / 2 - 12
  const cx = size / 2
  const cy = size / 2
  const sw = 6

  function arcPath(startFrac: number, endFrac: number) {
    const sa = startFrac * 2 * Math.PI - Math.PI / 2
    const ea = endFrac * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(sa)
    const y1 = cy + r * Math.sin(sa)
    const x2 = cx + r * Math.cos(ea)
    const y2 = cy + r * Math.sin(ea)
    const large = endFrac - startFrac > 0.5 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  const dayAngle = (day / totalDays) * 2 * Math.PI - Math.PI / 2
  const dotX = cx + r * Math.cos(dayAngle)
  const dotY = cy + r * Math.sin(dayAngle)

  return (
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {/* track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />

      {/* phase arcs */}
      {PHASE_ARCS.map((arc) => (
        <path
          key={arc.key}
          d={arcPath(arc.start, arc.end)}
          fill="none"
          stroke={arc.color}
          strokeWidth={sw}
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}

      {/* day dot */}
      <circle cx={dotX} cy={dotY} r={10} fill={color} opacity="0.95" />
      <circle cx={dotX} cy={dotY} r={6} fill="white" opacity="0.9" />
    </svg>
  )
}

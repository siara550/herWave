'use client'

import { useId } from 'react'

interface Props {
  /** 0 = new moon, 0.25 = waxing crescent, 0.5 = half, 0.75 = waning gibbous, 1 = full */
  phase: number
  color: string
  size?: number
  animated?: boolean
}

export default function MoonOrb({ phase, color, size = 200, animated = true }: Props) {
  const id = useId().replace(/:/g, '')
  const r = size / 2
  const glowSize = size * 1.5

  type LitInfo = { waxing: boolean; ex: number }
  function getLitInfo(p: number): LitInfo | null {
    if (p === 0 || p === 1) return null
    const waxing = p <= 0.5
    const normalized = waxing ? p * 2 : (p - 0.5) * 2
    const ex = Math.abs(Math.cos(normalized * Math.PI)) * r
    return { waxing, ex }
  }

  const litInfo = getLitInfo(phase)
  const clipId = `mc-${id}`
  const gradId = `mg-${id}`

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* outer glow */}
      <div
        style={{
          position: 'absolute',
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}35 0%, ${color}10 40%, transparent 70%)`,
          animation: animated ? 'moonPulse 4s ease-in-out infinite' : 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <clipPath id={clipId}>
            <circle cx={r} cy={r} r={r - 2} />
          </clipPath>
          <radialGradient id={gradId} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={phase === 1 ? '#fff9' : color} stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* base */}
        <circle
          cx={r} cy={r} r={r - 2}
          fill={phase === 1 ? color : '#120429'}
          clipPath={`url(#${clipId})`}
        />

        {/* phase rendering */}
        {phase === 1 ? (
          <>
            <circle cx={r} cy={r} r={r - 2} fill={color} opacity="0.9" clipPath={`url(#${clipId})`} />
            <circle cx={r * 0.65} cy={r * 0.6} r={r * 0.07} fill="white" opacity="0.08" clipPath={`url(#${clipId})`} />
            <circle cx={r * 1.2} cy={r * 0.85} r={r * 0.05} fill="white" opacity="0.06" clipPath={`url(#${clipId})`} />
            <circle cx={r * 0.8} cy={r * 1.2} r={r * 0.09} fill="white" opacity="0.07" clipPath={`url(#${clipId})`} />
          </>
        ) : phase === 0 ? (
          <circle cx={r} cy={r} r={r - 2} fill="#120429" clipPath={`url(#${clipId})`} />
        ) : litInfo ? (
          <>
            <circle cx={r} cy={r} r={r - 2} fill="#120429" clipPath={`url(#${clipId})`} />
            {litInfo.waxing ? (
              <ellipse
                cx={r + litInfo.ex * 0.3} cy={r}
                rx={r * 0.72} ry={r - 2}
                fill={color} opacity="0.85"
                clipPath={`url(#${clipId})`}
              />
            ) : (
              <ellipse
                cx={r - litInfo.ex * 0.3} cy={r}
                rx={r * 0.72} ry={r - 2}
                fill={color} opacity="0.85"
                clipPath={`url(#${clipId})`}
              />
            )}
          </>
        ) : null}

        {/* surface gradient */}
        <circle cx={r} cy={r} r={r - 2} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />
        {/* border ring */}
        <circle cx={r} cy={r} r={r - 2} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      </svg>
    </div>
  )
}

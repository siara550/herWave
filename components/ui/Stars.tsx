'use client'

import { useMemo } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
}

export default function Stars({ count = 40 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.35 + 0.08,
        delay: Math.random() * 4,
      })),
    [count]
  )

  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            opacity: s.opacity,
            animation: `starTwinkle 3s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

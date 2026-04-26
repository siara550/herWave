'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { getCurrentPhase } from '@/lib/cycle'
import { HW_PHASES, toHWPhase } from '@/lib/hw-phases'
import MoonOrb from '@/components/ui/MoonOrb'
import CycleRing from '@/components/ui/CycleRing'
import HWCard from '@/components/ui/HWCard'
import type { Profile, SymptomLog } from '@/lib/types'

interface Props {
  profile: Profile
  todayLog: SymptomLog | null
}

export default function DashboardClient({ profile, todayLog }: Props) {
  const [aiTip, setAiTip] = useState('')
  const [tipLoading, setTipLoading] = useState(true)

  const cycleInfo = getCurrentPhase(profile.last_period_date, profile.cycle_length)
  const hwPhase = toHWPhase(cycleInfo.phase)
  const p = HW_PHASES[hwPhase]
  const currentDay = cycleInfo.dayOfCycle
  const daysToNext = Math.max(0, (profile.cycle_length ?? 29) - currentDay)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const firstName = profile.name?.split(' ')[0] || 'Beautiful'

  useEffect(() => {
    async function fetchTip() {
      try {
        const res = await fetch('/api/ai/daily-tip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phase: cycleInfo.phase, dayOfCycle: currentDay }),
        })
        const data = await res.json()
        setAiTip(data.tip || '')
      } catch {
        setAiTip(p.tips[currentDay % p.tips.length])
      } finally {
        setTipLoading(false)
      }
    }
    fetchTip()
  }, [cycleInfo.phase, currentDay, p.tips])

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 0' }}>
      {/* Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <p style={{ color: '#9b8db0', fontSize: 13, margin: 0 }}>{greeting},</p>
          <h2 style={{ color: 'white', fontSize: 24, fontFamily: 'var(--font-playfair)', fontWeight: 700, margin: '2px 0 0' }}>
            {firstName} ✦
          </h2>
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 99,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          🌸
        </div>
      </div>

      {/* Moon + Cycle Ring hero */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
        <div style={{ position: 'relative', width: 260, height: 260 }}>
          <CycleRing
            day={currentDay}
            totalDays={profile.cycle_length ?? 29}
            color={p.color}
            size={260}
          />
          {/* Moon orb centered inside ring */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <MoonOrb phase={p.moonPhase} color={p.color} size={180} />
          </div>
          {/* Day text overlaid on moon */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: 32, fontFamily: 'var(--font-playfair)', fontWeight: 700, color: 'white' }}>
              {currentDay}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#c4b5d8',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Day of cycle
            </div>
          </div>
        </div>
      </div>

      {/* Phase card */}
      <div style={{ marginBottom: 14 }}>
        <Link href="/calendar" style={{ textDecoration: 'none' }}>
          <HWCard
            style={{
              background: `linear-gradient(135deg, ${p.colorSoft}, rgba(30,10,56,0.4))`,
              border: `1px solid ${p.color}40`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <span
                    style={{
                      color: p.color,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {p.name} Phase · {p.dayRange}
                  </span>
                </div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 700,
                    margin: '0 0 6px',
                  }}
                >
                  {p.tagline}
                </h3>
                <p style={{ color: '#c4b5d8', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  {p.description.slice(0, 80)}…
                </p>
              </div>
              <div style={{ color: p.color, fontSize: 22, marginLeft: 10 }}>›</div>
            </div>
          </HWCard>
        </Link>
      </div>

      {/* Today's forecast */}
      <p
        style={{
          color: '#9b8db0',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 10,
        }}
      >
        Today&apos;s forecast
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Energy', value: p.energy, icon: '⚡' },
          { label: 'Mood', value: p.mood, icon: '✨' },
          { label: 'Libido', value: p.libido, icon: '🌸' },
        ].map((item) => (
          <HWCard key={item.label} style={{ padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 99,
                    background: n <= item.value ? p.color : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
            <div style={{ color: '#9b8db0', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {item.label}
            </div>
          </HWCard>
        ))}
      </div>

      {/* Next period */}
      <div style={{ marginBottom: 14 }}>
        <HWCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#9b8db0', fontSize: 11, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>
                Next period
              </p>
              <p style={{ color: 'white', fontSize: 18, fontFamily: 'var(--font-playfair)', fontWeight: 600, margin: 0 }}>
                in {daysToNext} days
              </p>
            </div>
            <div
              style={{
                background: 'rgba(244,63,94,0.12)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 12,
                padding: '8px 14px',
                color: '#f43f5e',
                fontSize: 12,
              }}
            >
              {format(
                new Date(Date.now() + daysToNext * 86400000),
                'MMM d'
              )}{' '}
              🌑
            </div>
          </div>
        </HWCard>
      </div>

      {/* AI Tip */}
      <div style={{ marginBottom: 14 }}>
        <HWCard
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(219,39,119,0.12))',
            border: '1px solid rgba(192,132,252,0.2)',
          }}
        >
          <p style={{ color: '#c084fc', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
            💜 Today&apos;s tip
          </p>
          {tipLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 0.8, 0.6].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 10,
                    borderRadius: 99,
                    background: 'rgba(192,132,252,0.15)',
                    width: `${w * 100}%`,
                    animation: 'dotBounce 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: 'white', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{aiTip}</p>
          )}
        </HWCard>
      </div>

      {/* Today's log quick card */}
      <div style={{ marginBottom: 14 }}>
        <HWCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ color: '#9b8db0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
              Today&apos;s log
            </p>
            <Link
              href="/tracker"
              style={{ color: '#c084fc', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
            >
              {todayLog ? 'Edit' : 'Log now'} →
            </Link>
          </div>
          {todayLog ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {[
                { key: 'mood', label: 'Mood', icon: '😊' },
                { key: 'energy', label: 'Energy', icon: '⚡' },
                { key: 'cramps', label: 'Cramps', icon: '🌀' },
                { key: 'bloating', label: 'Bloating', icon: '💧' },
                { key: 'flow_intensity', label: 'Flow', icon: '🌊' },
              ].map(({ key, label, icon }) => {
                const val = todayLog[key as keyof SymptomLog] as number | null
                return (
                  <div key={key} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div style={{ fontSize: 10, color: '#9b8db0', marginTop: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: p.color, marginTop: 2 }}>
                      {val != null ? `${val}/5` : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: '#6b5a8a', fontSize: 13 }}>You haven&apos;t logged anything yet today.</p>
          )}
        </HWCard>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <Link href="/chat" style={{ textDecoration: 'none' }}>
          <HWCard style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🌙
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>HerAI</div>
              <div style={{ color: '#6b5a8a', fontSize: 11 }}>Ask anything</div>
            </div>
          </HWCard>
        </Link>
        <Link href="/insights" style={{ textDecoration: 'none' }}>
          <HWCard style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                background: `${p.color}25`,
                border: `1px solid ${p.color}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              📊
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Insights</div>
              <div style={{ color: '#6b5a8a', fontSize: 11 }}>Your patterns</div>
            </div>
          </HWCard>
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { HW_PHASES, toHWPhase } from '@/lib/hw-phases'
import HWCard from '@/components/ui/HWCard'
import type { Profile } from '@/lib/types'
import type { PhaseInfo } from '@/lib/cycle'

interface InsightCategory {
  title: string
  tip: string
  foods?: string[]
  activities?: string[]
}

interface Insights {
  nutrition: InsightCategory
  workout: InsightCategory
  sleep: InsightCategory
  mood: InsightCategory
}

interface Props {
  profile: Profile
  phaseInfo: PhaseInfo
}

const CATEGORIES = [
  { key: 'nutrition', label: 'Nutrition', emoji: '🥗' },
  { key: 'workout', label: 'Workout', emoji: '🏃‍♀️' },
  { key: 'sleep', label: 'Sleep', emoji: '🌙' },
  { key: 'mood', label: 'Mood', emoji: '💫' },
]

// Sample static insights data
const SAMPLE_INSIGHTS = {
  cycleLength: { avg: 29, range: '27–31', trend: 'stable' },
  periodLength: { avg: 5, range: '4–6', trend: 'stable' },
  topSymptoms: [
    { name: 'Cramps', frequency: 85, phase: 'menstrual' as const },
    { name: 'Bloating', frequency: 70, phase: 'luteal' as const },
    { name: 'Fatigue', frequency: 65, phase: 'menstrual' as const },
    { name: 'Mood Swings', frequency: 55, phase: 'luteal' as const },
  ],
  mood: [
    { day: 'Mon', score: 3 },
    { day: 'Tue', score: 4 },
    { day: 'Wed', score: 5 },
    { day: 'Thu', score: 4 },
    { day: 'Fri', score: 3 },
    { day: 'Sat', score: 2 },
    { day: 'Sun', score: 3 },
  ],
}

export default function InsightsClient({ phaseInfo }: Props) {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const p = HW_PHASES[toHWPhase(phaseInfo.phase)]

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phase: phaseInfo.phase, dayOfCycle: phaseInfo.dayOfCycle }),
        })
        const data = await res.json()
        setInsights(data.insights)
      } catch {
        setInsights(null)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [phaseInfo.phase, phaseInfo.dayOfCycle])

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 0' }}>
      <h2
        style={{
          color: 'white',
          fontSize: 26,
          fontFamily: 'var(--font-playfair)',
          fontWeight: 700,
          margin: '0 0 4px',
        }}
      >
        Your Insights
      </h2>
      <p style={{ color: '#9b8db0', fontSize: 13, margin: '0 0 24px' }}>
        Based on your cycle history
      </p>

      {/* Current phase banner */}
      <HWCard
        style={{
          background: `linear-gradient(135deg, ${p.colorSoft}, rgba(30,10,56,0.4))`,
          border: `1px solid ${p.color}40`,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{p.emoji}</span>
          <div>
            <p style={{ color: p.color, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 2px' }}>
              {p.name} Phase · Day {phaseInfo.dayOfCycle}
            </p>
            <p style={{ color: 'white', fontSize: 15, fontFamily: 'var(--font-playfair)', fontWeight: 600, margin: 0 }}>
              {p.tagline}
            </p>
          </div>
        </div>
      </HWCard>

      {/* Cycle stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <HWCard>
          <p style={{ color: '#9b8db0', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>
            Avg cycle
          </p>
          <p style={{ color: 'white', fontSize: 30, fontFamily: 'var(--font-playfair)', fontWeight: 700, margin: '0 0 2px' }}>
            {SAMPLE_INSIGHTS.cycleLength.avg}
            <span style={{ fontSize: 14, color: '#9b8db0' }}> days</span>
          </p>
          <p style={{ color: '#6b5a8a', fontSize: 11, margin: 0 }}>
            Range: {SAMPLE_INSIGHTS.cycleLength.range}
          </p>
        </HWCard>
        <HWCard>
          <p style={{ color: '#9b8db0', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>
            Avg period
          </p>
          <p style={{ color: 'white', fontSize: 30, fontFamily: 'var(--font-playfair)', fontWeight: 700, margin: '0 0 2px' }}>
            {SAMPLE_INSIGHTS.periodLength.avg}
            <span style={{ fontSize: 14, color: '#9b8db0' }}> days</span>
          </p>
          <p style={{ color: '#6b5a8a', fontSize: 11, margin: 0 }}>
            Range: {SAMPLE_INSIGHTS.periodLength.range}
          </p>
        </HWCard>
      </div>

      {/* Mood chart */}
      <HWCard style={{ marginBottom: 16 }}>
        <p style={{ color: '#9b8db0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 16px' }}>
          Mood this week
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {SAMPLE_INSIGHTS.mood.map((m) => (
            <div key={m.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: '100%',
                  borderRadius: '6px 6px 3px 3px',
                  height: `${(m.score / 5) * 64}px`,
                  background:
                    m.day === 'Wed'
                      ? 'linear-gradient(180deg, #c084fc, #7c3aed)'
                      : 'rgba(255,255,255,0.08)',
                  transition: 'height 0.8s ease',
                }}
              />
              <span style={{ color: '#6b5a8a', fontSize: 10 }}>{m.day}</span>
            </div>
          ))}
        </div>
      </HWCard>

      {/* Top symptoms */}
      <HWCard style={{ marginBottom: 16 }}>
        <p style={{ color: '#9b8db0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 16px' }}>
          Top symptoms
        </p>
        {SAMPLE_INSIGHTS.topSymptoms.map((s) => {
          const ph = HW_PHASES[toHWPhase(s.phase === 'menstrual' ? 'menstrual' : 'luteal')]
          return (
            <div key={s.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'white', fontSize: 13 }}>{s.name}</span>
                <span style={{ color: ph.color, fontSize: 12 }}>{s.frequency}%</span>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 99,
                  height: 5,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${s.frequency}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${ph.color}, ${ph.color}80)`,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          )
        })}
      </HWCard>

      {/* AI category insights */}
      <p style={{ color: '#9b8db0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 12px' }}>
        Personalized for your {p.name} phase
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {CATEGORIES.map((cat) => (
          <HWCard
            key={cat.key}
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            style={{
              border: activeCategory === cat.key ? `1px solid ${p.color}60` : undefined,
              background:
                activeCategory === cat.key
                  ? `linear-gradient(135deg, ${p.colorSoft}, rgba(30,10,56,0.5))`
                  : undefined,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.emoji}</div>
            <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{cat.label}</div>
            {activeCategory === cat.key && insights ? (
              <p style={{ color: '#c4b5d8', fontSize: 12, lineHeight: 1.6, margin: '8px 0 0' }}>
                {insights[cat.key as keyof Insights]?.tip}
              </p>
            ) : loading && activeCategory === cat.key ? (
              <p style={{ color: '#6b5a8a', fontSize: 12, margin: '8px 0 0' }}>Loading…</p>
            ) : (
              <p style={{ color: '#6b5a8a', fontSize: 11, margin: '4px 0 0' }}>Tap to explore</p>
            )}
          </HWCard>
        ))}
      </div>

      {/* AI insight */}
      <HWCard
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(219,39,119,0.12))',
          border: '1px solid rgba(192,132,252,0.2)',
          marginBottom: 20,
        }}
      >
        <p style={{ color: '#c084fc', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
          🔮 AI insight
        </p>
        <p style={{ color: 'white', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
          Your cycle is very consistent — a great sign of hormonal balance. Cramps cluster in your menstrual phase; magnesium supplementation may help reduce their frequency.
        </p>
      </HWCard>
    </div>
  )
}

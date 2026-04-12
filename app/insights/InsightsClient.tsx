'use client'

import { useState, useEffect } from 'react'
import { PHASE_LABELS, PHASE_BG } from '@/lib/cycle'
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

const CATEGORY_CONFIG = [
  { key: 'nutrition', label: 'Nutrition', emoji: '🥗', gradient: 'from-green-400 to-emerald-500' },
  { key: 'workout', label: 'Workout', emoji: '🏃‍♀️', gradient: 'from-orange-400 to-amber-500' },
  { key: 'sleep', label: 'Sleep', emoji: '🌙', gradient: 'from-indigo-400 to-blue-500' },
  { key: 'mood', label: 'Mood', emoji: '💫', gradient: 'from-pink-400 to-rose-500' },
]

export default function InsightsClient({ phaseInfo }: Props) {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">AI Insights</h1>
      <p className="text-gray-400 text-sm mb-5">Personalized for your {PHASE_LABELS[phaseInfo.phase]} phase</p>

      {/* Phase badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${PHASE_BG[phaseInfo.phase]}`}>
        <span>Day {phaseInfo.dayOfCycle} · {PHASE_LABELS[phaseInfo.phase]} Phase</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {CATEGORY_CONFIG.map((cat) => (
            <div key={cat.key} className="glass rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {CATEGORY_CONFIG.map((cat) => {
            const insight = insights?.[cat.key as keyof Insights]
            const isExpanded = activeCategory === cat.key

            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(isExpanded ? null : cat.key)}
                className="glass rounded-2xl p-5 shadow-sm text-left card-hover w-full"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                      {cat.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">{cat.label}</h3>
                        <span className="text-gray-400 text-sm">{isExpanded ? '↑' : '↓'}</span>
                      </div>
                      {insight && (
                        <p className="text-sm text-purple-600 font-medium mt-0.5">{insight.title}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && insight && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{insight.tip}</p>

                    {insight.foods && insight.foods.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Focus foods</p>
                        <div className="flex flex-wrap gap-2">
                          {insight.foods.map((food: string) => (
                            <span key={food} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {insight.activities && insight.activities.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Best activities</p>
                        <div className="flex flex-wrap gap-2">
                          {insight.activities.map((activity: string) => (
                            <span key={activity} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100">
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

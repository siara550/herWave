'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { getCurrentPhase, getNextPeriodDate, PHASE_LABELS, PHASE_DESCRIPTIONS } from '@/lib/cycle'
import type { Profile, SymptomLog } from '@/lib/types'

interface Props {
  profile: Profile
  todayLog: SymptomLog | null
}

export default function DashboardClient({ profile, todayLog }: Props) {
  const [aiTip, setAiTip] = useState('')
  const [tipLoading, setTipLoading] = useState(true)

  const phaseInfo = getCurrentPhase(profile.last_period_date, profile.cycle_length)
  const nextPeriod = getNextPeriodDate(profile.last_period_date, profile.cycle_length)
  const daysToNext = Math.max(0, Math.ceil((nextPeriod.getTime() - Date.now()) / 86400000))

  useEffect(() => {
    async function fetchTip() {
      try {
        const res = await fetch('/api/ai/daily-tip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phase: phaseInfo.phase, dayOfCycle: phaseInfo.dayOfCycle }),
        })
        const data = await res.json()
        setAiTip(data.tip || '')
      } catch {
        setAiTip('Take care of yourself today — you deserve it.')
      } finally {
        setTipLoading(false)
      }
    }
    fetchTip()
  }, [phaseInfo.phase, phaseInfo.dayOfCycle])

  const phaseColorMap: Record<string, string> = {
    menstrual: 'from-red-400 to-pink-400',
    follicular: 'from-purple-400 to-violet-500',
    ovulatory: 'from-orange-400 to-amber-400',
    luteal: 'from-indigo-400 to-blue-400',
  }

  const phaseEmoji: Record<string, string> = {
    menstrual: '🌑',
    follicular: '🌱',
    ovulatory: '🌕',
    luteal: '🍂',
  }

  const firstName = profile.name?.split(' ')[0] || 'there'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Hi, {firstName} 👋
        </h1>
        <p className="text-gray-400 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>

      {/* Phase hero card */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${phaseColorMap[phaseInfo.phase]} text-white shadow-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Current Phase</p>
            <h2 className="text-3xl font-bold mt-1 flex items-center gap-2">
              {phaseEmoji[phaseInfo.phase]} {PHASE_LABELS[phaseInfo.phase]}
            </h2>
            <p className="text-white/80 text-sm mt-1">Day {phaseInfo.dayOfCycle} of {profile.cycle_length}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{phaseInfo.dayOfCycle}</div>
            <div className="text-white/70 text-xs">cycle day</div>
          </div>
        </div>
        <p className="text-white/80 text-sm mt-4 leading-relaxed">
          {PHASE_DESCRIPTIONS[phaseInfo.phase]}
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm">
            <span className="font-semibold">{phaseInfo.daysRemaining}</span>
            <span className="text-white/70 ml-1">days in phase</span>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm">
            <span className="font-semibold">{daysToNext}</span>
            <span className="text-white/70 ml-1">to next period</span>
          </div>
        </div>
      </div>

      {/* AI Tip */}
      <div className="glass rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✨</span>
          <h3 className="font-semibold text-gray-700">Your tip for today</h3>
        </div>
        {tipLoading ? (
          <div className="space-y-2">
            <div className="h-3 bg-purple-100 rounded-full animate-pulse w-full" />
            <div className="h-3 bg-purple-100 rounded-full animate-pulse w-4/5" />
            <div className="h-3 bg-purple-100 rounded-full animate-pulse w-3/5" />
          </div>
        ) : (
          <p className="text-gray-600 text-sm leading-relaxed">{aiTip}</p>
        )}
      </div>

      {/* Quick log */}
      <div className="glass rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Today&apos;s log</h3>
          <Link href="/tracker" className="text-purple-500 text-sm font-medium hover:underline">
            {todayLog ? 'Edit' : 'Log now'} →
          </Link>
        </div>
        {todayLog ? (
          <div className="grid grid-cols-5 gap-2">
            {[
              { key: 'mood', label: 'Mood', emoji: '😊' },
              { key: 'energy', label: 'Energy', emoji: '⚡' },
              { key: 'cramps', label: 'Cramps', emoji: '🌀' },
              { key: 'bloating', label: 'Bloating', emoji: '💨' },
              { key: 'flow_intensity', label: 'Flow', emoji: '🌊' },
            ].map(({ key, label, emoji }) => {
              const val = todayLog[key as keyof SymptomLog] as number | null
              return (
                <div key={key} className="text-center">
                  <div className="text-2xl">{emoji}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                  <div className="text-sm font-semibold text-purple-600 mt-0.5">
                    {val != null ? `${val}/5` : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">You haven&apos;t logged anything yet today.</p>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/calendar" className="glass rounded-xl p-4 card-hover flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <div className="font-medium text-gray-700 text-sm">Calendar</div>
            <div className="text-xs text-gray-400">View your phases</div>
          </div>
        </Link>
        <Link href="/insights" className="glass rounded-xl p-4 card-hover flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <div>
            <div className="font-medium text-gray-700 text-sm">Insights</div>
            <div className="text-xs text-gray-400">AI recommendations</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

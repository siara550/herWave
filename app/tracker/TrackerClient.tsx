'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { Profile, SymptomLog, PeriodLog } from '@/lib/types'

interface Props {
  userId: string
  profile: Profile
  logs: SymptomLog[]
  periodLogs: PeriodLog[]
}

const SYMPTOM_FIELDS = [
  { key: 'mood', label: 'Mood', emoji: '😊', color: 'purple' },
  { key: 'energy', label: 'Energy', emoji: '⚡', color: 'yellow' },
  { key: 'cramps', label: 'Cramps', emoji: '🌀', color: 'red' },
  { key: 'bloating', label: 'Bloating', emoji: '💨', color: 'blue' },
  { key: 'flow_intensity', label: 'Flow', emoji: '🌊', color: 'pink' },
]

function RatingSelector({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
            value === n
              ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md scale-110'
              : 'bg-purple-50 text-gray-400 hover:bg-purple-100'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

export default function TrackerClient({ userId, profile, logs, periodLogs }: Props) {
  const supabase = createClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const existingLog = logs.find((l) => l.date === today)

  const [activeTab, setActiveTab] = useState<'log' | 'period' | 'history'>('log')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [symptoms, setSymptoms] = useState({
    mood: existingLog?.mood ?? null,
    energy: existingLog?.energy ?? null,
    cramps: existingLog?.cramps ?? null,
    bloating: existingLog?.bloating ?? null,
    flow_intensity: existingLog?.flow_intensity ?? null,
  })
  const [notes, setNotes] = useState(existingLog?.notes ?? '')

  // Period tracking
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [periodSaving, setPeriodSaving] = useState(false)
  const [periodSaved, setPeriodSaved] = useState(false)

  async function saveSymptoms() {
    setSaving(true)
    setError('')
    const payload = { user_id: userId, date: today, ...symptoms, notes: notes || null }

    const { error } = existingLog
      ? await supabase.from('symptom_logs').update(payload).eq('id', existingLog.id)
      : await supabase.from('symptom_logs').insert(payload)

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  async function savePeriod() {
    if (!periodStart) return
    setPeriodSaving(true)
    const { error } = await supabase.from('period_logs').insert({
      user_id: userId,
      start_date: periodStart,
      end_date: periodEnd || null,
    })
    if (!error) {
      // Update last period date in profile
      await supabase
        .from('profiles')
        .update({ last_period_date: periodStart })
        .eq('user_id', userId)
      setPeriodSaved(true)
      setPeriodStart('')
      setPeriodEnd('')
      setTimeout(() => setPeriodSaved(false), 2000)
    }
    setPeriodSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Tracker</h1>
      <p className="text-gray-400 text-sm mb-5">{format(new Date(), 'EEEE, MMMM d')}</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-purple-50 rounded-xl p-1 mb-6">
        {[
          { key: 'log', label: 'Daily Log' },
          { key: 'period', label: 'Period' },
          { key: 'history', label: 'History' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily log tab */}
      {activeTab === 'log' && (
        <div className="glass rounded-2xl p-5 shadow-sm space-y-5">
          {existingLog && (
            <p className="text-xs text-purple-500 bg-purple-50 rounded-lg px-3 py-1.5">
              You logged today — editing your entry
            </p>
          )}

          {SYMPTOM_FIELDS.filter((f) => profile.symptoms_to_track?.includes(f.key)).map((field) => (
            <div key={field.key}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{field.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{field.label}</span>
              </div>
              <RatingSelector
                value={symptoms[field.key as keyof typeof symptoms]}
                onChange={(v) => setSymptoms((s) => ({ ...s, [field.key]: v }))}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder-gray-400 resize-none text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={saveSymptoms}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Log'}
          </button>
        </div>
      )}

      {/* Period tab */}
      {activeTab === 'period' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-700">Log a Period</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Start date</label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                max={today}
                className="w-full px-4 py-2.5 rounded-xl border border-purple-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">End date <span className="text-gray-400">(optional)</span></label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                min={periodStart}
                max={today}
                className="w-full px-4 py-2.5 rounded-xl border border-purple-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
              />
            </div>
            <button
              onClick={savePeriod}
              disabled={!periodStart || periodSaving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {periodSaved ? '✓ Saved!' : periodSaving ? 'Saving…' : 'Log Period'}
            </button>
          </div>

          {periodLogs.length > 0 && (
            <div className="glass rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Period History</h3>
              <div className="space-y-3">
                {periodLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-purple-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">🩸</span>
                      <span className="text-sm text-gray-700">
                        {format(parseISO(log.start_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {log.end_date
                        ? `→ ${format(parseISO(log.end_date), 'MMM d')}`
                        : 'ongoing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">📓</div>
              <p className="text-gray-500 text-sm">No logs yet. Start tracking today!</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="glass rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700 text-sm">
                    {format(parseISO(log.date), 'EEE, MMM d')}
                  </span>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {SYMPTOM_FIELDS.map(({ key, label, emoji }) => {
                    const val = log[key as keyof SymptomLog] as number | null
                    if (val == null) return null
                    return (
                      <div key={key} className="flex items-center gap-1.5 text-sm">
                        <span>{emoji}</span>
                        <span className="text-gray-500">{label}:</span>
                        <span className="font-semibold text-purple-600">{val}/5</span>
                      </div>
                    )
                  })}
                </div>
                {log.notes && (
                  <p className="text-xs text-gray-400 mt-2 italic">&ldquo;{log.notes}&rdquo;</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

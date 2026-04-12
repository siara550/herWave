'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
  userEmail: string
}

const SYMPTOMS = [
  { key: 'mood', label: 'Mood', emoji: '😊' },
  { key: 'energy', label: 'Energy', emoji: '⚡' },
  { key: 'cramps', label: 'Cramps', emoji: '🌀' },
  { key: 'bloating', label: 'Bloating', emoji: '💨' },
  { key: 'flow_intensity', label: 'Flow Intensity', emoji: '🌊' },
]

export default function ProfileClient({ profile, userEmail }: Props) {
  const supabase = createClient()
  const [name, setName] = useState(profile.name || '')
  const [cycleLength, setCycleLength] = useState(profile.cycle_length || 28)
  const [lastPeriodDate, setLastPeriodDate] = useState(profile.last_period_date || '')
  const [symptoms, setSymptoms] = useState<string[]>(profile.symptoms_to_track || [])
  const [notifications, setNotifications] = useState(profile.notifications_enabled ?? true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggleSymptom(key: string) {
    setSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    )
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        cycle_length: cycleLength,
        last_period_date: lastPeriodDate || null,
        symptoms_to_track: symptoms,
        notifications_enabled: notifications,
      })
      .eq('user_id', profile.user_id)

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : userEmail[0]?.toUpperCase() || '?'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

      {/* Avatar */}
      <div className="glass rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name || 'Your Name'}</p>
          <p className="text-gray-400 text-sm">{userEmail}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass rounded-2xl p-5 shadow-sm space-y-5">
        <h3 className="font-semibold text-gray-700">Personal Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last period date</label>
          <input
            type="date"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Average cycle length: <span className="text-purple-600 font-bold">{cycleLength} days</span>
          </label>
          <input
            type="range"
            min={20}
            max={45}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>20</span>
            <span>45</span>
          </div>
        </div>
      </div>

      {/* Tracking preferences */}
      <div className="glass rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-700">What to track</h3>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOMS.map((s) => (
            <button
              key={s.key}
              onClick={() => toggleSymptom(s.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                symptoms.includes(s.key)
                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                  : 'border-purple-100 bg-white/60 text-gray-600 hover:border-purple-200'
              }`}
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <p className="text-gray-400 text-sm mt-0.5">Daily wellness reminders</p>
          </div>
          <button
            onClick={() => setNotifications((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-all ${notifications ? 'bg-purple-400' : 'bg-gray-200'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {saved ? '✓ Changes saved!' : saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

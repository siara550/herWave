'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { getCurrentPhase } from '@/lib/cycle'
import { HW_PHASES, HW_SYMPTOMS, HW_MOODS, toHWPhase } from '@/lib/hw-phases'
import HWCard from '@/components/ui/HWCard'
import type { Profile, SymptomLog, PeriodLog } from '@/lib/types'

interface Props {
  userId: string
  profile: Profile
  logs: SymptomLog[]
  periodLogs?: PeriodLog[]
}

export default function TrackerClient({ userId, profile, logs }: Props) {
  const supabase = createClient()
  const today = format(new Date(), 'yyyy-MM-dd')
  const existingLog = logs.find((l) => l.date === today)

  const cycleInfo = getCurrentPhase(profile.last_period_date, profile.cycle_length)
  const p = HW_PHASES[toHWPhase(cycleInfo.phase)]

  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [flow, setFlow] = useState<string | null>(existingLog?.flow_intensity ? String(existingLog.flow_intensity) : null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState(existingLog?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggleSymptom(id: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = {
      user_id: userId,
      date: today,
      notes: notes || null,
    }
    const { error: err } = existingLog
      ? await supabase.from('symptom_logs').update(payload).eq('id', existingLog.id)
      : await supabase.from('symptom_logs').insert(payload)

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const flowOptions = ['None', 'Spotting', 'Light', 'Medium', 'Heavy']

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 0' }}>
      {/* Header */}
      <h2
        style={{
          color: 'white',
          fontSize: 26,
          fontFamily: 'var(--font-playfair)',
          fontWeight: 700,
          margin: '0 0 4px',
        }}
      >
        How are you today?
      </h2>
      <p style={{ color: '#9b8db0', fontSize: 13, margin: '0 0 24px' }}>
        {format(new Date(), 'MMMM d')} · {p.name} Phase {p.emoji}
      </p>

      {/* Mood */}
      <p
        style={{
          color: '#9b8db0',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          margin: '0 0 12px',
        }}
      >
        Mood
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {HW_MOODS.map((m) => {
          const active = selectedMood === m.id
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMood(active ? null : m.id)}
              style={{
                padding: '10px 16px',
                borderRadius: 99,
                border: `1px solid ${active ? p.color : 'rgba(255,255,255,0.12)'}`,
                background: active ? `${p.color}25` : 'rgba(42,16,69,0.4)',
                color: active ? 'white' : '#9b8db0',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <span>{m.emoji}</span> {m.label}
            </button>
          )
        })}
      </div>

      {/* Flow */}
      <p
        style={{
          color: '#9b8db0',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          margin: '0 0 12px',
        }}
      >
        Flow
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {flowOptions.map((f) => {
          const active = flow === f
          return (
            <button
              key={f}
              onClick={() => setFlow(active ? null : f)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 99,
                border: `1px solid ${active ? '#f43f5e' : 'rgba(255,255,255,0.12)'}`,
                background: active ? 'rgba(244,63,94,0.15)' : 'transparent',
                color: active ? '#f43f5e' : '#6b5a8a',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Symptoms */}
      <p
        style={{
          color: '#9b8db0',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          margin: '0 0 12px',
        }}
      >
        Symptoms
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {HW_SYMPTOMS.map((s) => {
          const active = selectedSymptoms.includes(s.id)
          return (
            <button
              key={s.id}
              onClick={() => toggleSymptom(s.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                border: `1px solid ${active ? p.color : 'rgba(255,255,255,0.12)'}`,
                background: active ? `${p.color}25` : 'transparent',
                color: active ? p.color : '#6b5a8a',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {s.icon} {s.label}
            </button>
          )
        })}
      </div>

      {/* Notes */}
      <p
        style={{
          color: '#9b8db0',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          margin: '0 0 12px',
        }}
      >
        Notes
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="How are you really feeling? No judgment here..."
        rows={4}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 16,
          background: 'rgba(42,16,69,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: 13,
          resize: 'none',
          outline: 'none',
          lineHeight: 1.6,
          boxSizing: 'border-box',
          fontFamily: 'var(--font-dm-sans)',
        }}
      />

      {error && (
        <p style={{ color: '#f43f5e', fontSize: 13, marginTop: 8 }}>{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%',
          marginTop: 20,
          marginBottom: 20,
          padding: 16,
          background: saved
            ? '#22c55e'
            : 'linear-gradient(135deg, #7c3aed, #db2777)',
          border: 'none',
          borderRadius: 18,
          color: 'white',
          fontSize: 15,
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 600,
          cursor: saving ? 'default' : 'pointer',
          opacity: saving ? 0.7 : 1,
          transition: 'background 0.3s',
          boxShadow: saved ? 'none' : '0 8px 32px rgba(219,39,119,0.4)',
        }}
      >
        {saved ? '✓ Saved!' : saving ? 'Saving…' : "Save Today's Log"}
      </button>

      {/* Recent logs */}
      {logs.length > 0 && (
        <>
          <p
            style={{
              color: '#9b8db0',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              margin: '0 0 12px',
            }}
          >
            Recent entries
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {logs.slice(0, 5).map((log) => (
              <HWCard key={log.id} style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#c4b5d8', fontSize: 13 }}>
                    {format(new Date(log.date), 'MMM d')}
                  </span>
                  {log.notes && (
                    <span style={{ color: '#6b5a8a', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.notes}
                    </span>
                  )}
                </div>
              </HWCard>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

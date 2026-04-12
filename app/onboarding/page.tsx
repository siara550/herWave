'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

const SYMPTOMS = [
  { key: 'mood', label: 'Mood', emoji: '😊' },
  { key: 'energy', label: 'Energy', emoji: '⚡' },
  { key: 'cramps', label: 'Cramps', emoji: '🌀' },
  { key: 'bloating', label: 'Bloating', emoji: '💨' },
  { key: 'flow_intensity', label: 'Flow Intensity', emoji: '🌊' },
]

const STEPS = ['Welcome', 'Last Period', 'Cycle Length', 'Symptoms']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    SYMPTOMS.map((s) => s.key)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleSymptom(key: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    )
  }

  async function handleComplete() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        last_period_date: lastPeriodDate,
        cycle_length: cycleLength,
        symptoms_to_track: selectedSymptoms,
        onboarding_complete: true,
      })
      .eq('user_id', user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl">🌊</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mt-2">
            Let&apos;s set up HerWave
          </h1>
          <p className="text-gray-500 text-sm mt-1">Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-purple-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="glass rounded-2xl p-6 shadow-xl shadow-purple-100 min-h-[280px] flex flex-col">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="flex-1 flex flex-col justify-center text-center">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to HerWave</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                We&apos;ll ask you a few quick questions to personalize your experience.
                Your data is private and secure.
              </p>
            </div>
          )}

          {/* Step 1: Last period date */}
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">When did your last period start?</h2>
              <p className="text-gray-500 text-sm mb-6">This helps us calculate your current cycle phase.</p>
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
              />
            </div>
          )}

          {/* Step 2: Cycle length */}
          {step === 2 && (
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">How long is your typical cycle?</h2>
              <p className="text-gray-500 text-sm mb-6">The average is 28 days, but cycles vary.</p>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setCycleLength((v) => Math.max(20, v - 1))}
                  className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 text-xl font-bold flex items-center justify-center hover:bg-purple-200 transition-all"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {cycleLength}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">days</p>
                </div>
                <button
                  onClick={() => setCycleLength((v) => Math.min(45, v + 1))}
                  className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 text-xl font-bold flex items-center justify-center hover:bg-purple-200 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Symptoms */}
          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">What do you want to track?</h2>
              <p className="text-gray-500 text-sm mb-5">Select all that apply.</p>
              <div className="grid grid-cols-2 gap-3">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => toggleSymptom(s.key)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      selectedSymptoms.includes(s.key)
                        ? 'border-purple-400 bg-purple-50 text-purple-700'
                        : 'border-purple-100 bg-white/60 text-gray-600 hover:border-purple-200'
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-3">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 rounded-xl text-purple-600 font-medium hover:bg-purple-50 transition-all"
              >
                Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !lastPeriodDate}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading || selectedSymptoms.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? 'Saving…' : "Let's Go! 🎉"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

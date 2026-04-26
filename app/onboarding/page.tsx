'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import Stars from '@/components/ui/Stars'
import MoonOrb from '@/components/ui/MoonOrb'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [cycleLength, setCycleLength] = useState(29)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const steps = [
    {
      title: 'Welcome to\nHerWave',
      sub: 'Your body has a rhythm. We help you understand it — deeply.',
    },
    {
      title: 'When did your\nlast period start?',
      sub: "This helps us calculate where you are in your cycle right now.",
    },
    {
      title: 'Your cycle\nlength',
      sub: 'Average is 28–30 days. Don\'t know? Start with 29.',
    },
  ]

  async function handleComplete() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    const { error: err } = await supabase
      .from('profiles')
      .update({
        last_period_date: lastPeriodDate,
        cycle_length: cycleLength,
        onboarding_complete: true,
      })
      .eq('user_id', user.id)

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  const isLast = step === steps.length - 1
  const current = steps[step]

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 20px',
    borderRadius: 16,
    background: 'rgba(42,16,69,0.5)',
    border: '1px solid rgba(192,132,252,0.4)',
    color: 'white',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-dm-sans)',
    colorScheme: 'dark',
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #18062a 0%, #1e0738 60%, #12042a 100%)' }}
    >
      <Stars count={40} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          maxWidth: 480,
          margin: '0 auto',
          width: '100%',
          padding: '48px 28px 40px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 36 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 28 : 6,
                height: 6,
                borderRadius: 99,
                background: i === step ? '#c084fc' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 38,
            fontWeight: 700,
            color: 'white',
            whiteSpace: 'pre-line',
            lineHeight: 1.15,
            margin: '0 0 10px',
          }}
        >
          {current.title}
        </h1>
        <p style={{ color: '#9b8db0', fontSize: 14, lineHeight: 1.6, margin: '0 0 36px' }}>
          {current.sub}
        </p>

        {/* Step content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 36px' }}>
                <MoonOrb phase={0.25} color="#c084fc" size={200} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                    borderRadius: 99,
                    padding: '5px 18px',
                    fontSize: 12,
                    color: 'white',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  🌒 Follicular Phase
                </div>
              </div>
              <p style={{ color: '#c4b5d8', fontSize: 14, lineHeight: 1.65, margin: '0 10px' }}>
                Track your cycle, understand your phases, and let AI be your knowledgeable companion.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                style={inputStyle}
              />
              <p style={{ color: '#6b5a8a', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
                This stays on your device. We value your privacy.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <span
                  style={{
                    fontSize: 72,
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 700,
                    color: '#c084fc',
                  }}
                >
                  {cycleLength}
                </span>
                <span style={{ fontSize: 20, color: '#c4b5d8' }}> days</span>
              </div>
              <input
                type="range"
                min={21}
                max={40}
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#c084fc' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ color: '#6b5a8a', fontSize: 12 }}>21 days</span>
                <span style={{ color: '#6b5a8a', fontSize: 12 }}>40 days</span>
              </div>
              <div
                style={{
                  marginTop: 28,
                  background: 'rgba(192,132,252,0.08)',
                  border: '1px solid rgba(192,132,252,0.2)',
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <p style={{ color: '#c4b5d8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                  💜 HerWave learns your unique rhythm over time and gets smarter each cycle.
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p style={{ color: '#f43f5e', fontSize: 13, margin: '0 0 12px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        {/* CTA button */}
        <button
          onClick={() => (isLast ? handleComplete() : setStep((s) => s + 1))}
          disabled={loading || (step === 1 && !lastPeriodDate)}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            border: 'none',
            color: 'white',
            fontSize: 16,
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 600,
            cursor: loading || (step === 1 && !lastPeriodDate) ? 'default' : 'pointer',
            opacity: loading || (step === 1 && !lastPeriodDate) ? 0.5 : 1,
            letterSpacing: 0.3,
            boxShadow: '0 8px 32px rgba(219,39,119,0.4)',
          }}
        >
          {loading ? 'Saving…' : isLast ? 'Start My Journey ✦' : 'Continue'}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b5a8a',
              fontSize: 14,
              cursor: 'pointer',
              marginTop: 14,
              padding: 8,
              textAlign: 'center',
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

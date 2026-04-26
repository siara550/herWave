'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Stars from '@/components/ui/Stars'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 14,
    background: 'rgba(42,16,69,0.5)',
    border: '1px solid rgba(192,132,252,0.25)',
    color: 'white',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'var(--font-dm-sans)',
    boxSizing: 'border-box',
    colorScheme: 'dark',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #18062a 0%, #1e0738 60%, #12042a 100%)' }}
    >
      <Stars count={30} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <h1
              style={{
                fontSize: 32,
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #c084fc, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 6px',
              }}
            >
              🌊 HerWave
            </h1>
          </Link>
          <p style={{ color: '#6b5a8a', fontSize: 14, margin: 0 }}>Welcome back</p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(42,16,69,0.6), rgba(30,10,56,0.6))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: '32px 28px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            {error && (
              <p
                style={{
                  color: '#f43f5e',
                  fontSize: 13,
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                border: 'none',
                color: 'white',
                fontSize: 15,
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 8px 32px rgba(219,39,119,0.35)',
                marginTop: 4,
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#6b5a8a', fontSize: 14, marginTop: 20 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

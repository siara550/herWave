'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async () => {
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/onboarding')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: '#f0eee8', marginBottom: '0.25rem' }}>
          her<span style={{ color: '#d4537e' }}>wave</span>
        </h1>
        <p style={{ color: 'rgba(240,238,232,0.4)', fontSize: '14px', marginBottom: '2.5rem' }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '10px',
            color: '#f0eee8', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '10px',
            color: '#f0eee8', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box'
          }}
        />

        {error && <p style={{ color: '#ed93b1', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', background: '#d4537e',
            border: 'none', borderRadius: '10px', color: '#fff',
            fontSize: '15px', fontWe
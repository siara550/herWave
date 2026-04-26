'use client'

import { useState, useRef, useEffect } from 'react'
import { getCurrentPhase } from '@/lib/cycle'
import { HW_PHASES, toHWPhase } from '@/lib/hw-phases'
import type { Profile } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  profile: Profile
}

export default function ChatClient({ profile }: Props) {
  const cycleInfo = getCurrentPhase(profile.last_period_date, profile.cycle_length)
  const p = HW_PHASES[toHWPhase(cycleInfo.phase)]
  const firstName = profile.name?.split(' ')[0] || 'beautiful'

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${firstName} 💜 I'm HerAI — your personal cycle guide. I know you're in your **${p.name} phase** right now. Ask me anything about your hormones, symptoms, nutrition, or what to expect this cycle.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    `Why do I feel tired in my ${p.name} phase?`,
    'What foods help with cramps?',
    'How do hormones affect my mood?',
    'When am I most fertile?',
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    if (!text.trim() || loading) return
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          phase: p.key,
          phaseName: p.name,
          dayRange: p.dayRange,
          cycleLength: profile.cycle_length,
          userName: firstName,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || "I'm having a moment — try again in a sec 💜" },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having a moment — try again in a sec 💜" },
      ])
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '0 auto',
        height: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 99,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🌙
        </div>
        <div>
          <h3
            style={{
              color: 'white',
              fontSize: 17,
              fontFamily: 'var(--font-playfair)',
              fontWeight: 700,
              margin: 0,
            }}
          >
            HerAI
          </h3>
          <p style={{ color: '#9b8db0', fontSize: 11, margin: 0 }}>
            Your cycle companion · {p.emoji} {p.name} phase
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 14,
            }}
          >
            {msg.role === 'assistant' && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99,
                  background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  marginRight: 8,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                🌙
              </div>
            )}
            <div
              style={{
                maxWidth: '78%',
                padding: '11px 15px',
                borderRadius:
                  msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                background:
                  msg.role === 'user'
                    ? 'linear-gradient(135deg, #7c3aed, #db2777)'
                    : 'rgba(42,16,69,0.6)',
                border:
                  msg.role === 'assistant'
                    ? '1px solid rgba(255,255,255,0.08)'
                    : 'none',
                color: 'white',
                fontSize: 13.5,
                lineHeight: 1.65,
              }}
            >
              {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 99,
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              🌙
            </div>
            <div
              style={{
                background: 'rgba(42,16,69,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px 18px 18px 4px',
                padding: '12px 16px',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: '#c084fc',
                    animation: 'dotBounce 1.2s ease-in-out infinite',
                    animationDelay: `${d * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (shown only at start) */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: '0 16px 8px',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                border: '1px solid rgba(192,132,252,0.3)',
                background: 'rgba(192,132,252,0.08)',
                color: '#c4b5d8',
                fontSize: 11.5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '10px 16px 20px',
          display: 'flex',
          gap: 10,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Ask me anything…"
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: 99,
            background: 'rgba(42,16,69,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: 13,
            outline: 'none',
            fontFamily: 'var(--font-dm-sans)',
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          style={{
            width: 46,
            height: 46,
            borderRadius: 99,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            border: 'none',
            cursor: !input.trim() || loading ? 'default' : 'pointer',
            opacity: !input.trim() || loading ? 0.5 : 1,
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>
    </div>
  )
}

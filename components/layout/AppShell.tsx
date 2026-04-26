'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v11h14V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V14h6v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/calendar',
    label: 'Cycle',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/tracker',
    label: 'Track',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'HerAI',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="8" cy="10" r="1" fill="currentColor" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="16" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/insights',
    label: 'Insights',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 20h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 20V12l4-4 4 4 4-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #18062a 0%, #1e0738 60%, #12042a 100%)' }}
    >
      {/* Desktop top header */}
      <header
        className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-20"
        style={{
          background: 'rgba(18,4,42,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-bold"
          style={{
            fontFamily: 'var(--font-playfair)',
            background: 'linear-gradient(135deg, #c084fc, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🌊 HerWave
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  color: active ? '#c084fc' : '#6b5a8a',
                  background: active ? 'rgba(192,132,252,0.12)' : 'transparent',
                  border: active
                    ? '1px solid rgba(192,132,252,0.25)'
                    : '1px solid transparent',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <button
          onClick={handleSignOut}
          className="text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#6b5a8a' }}
        >
          Sign out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-6">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed bottom-0 inset-x-0 md:hidden z-20 flex items-end pb-5"
        style={{
          height: 80,
          background: 'linear-gradient(180deg, transparent 0%, #18062a 20%)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 transition-colors"
              style={{ color: active ? '#c084fc' : '#6b5a8a' }}
            >
              {item.icon}
              <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 400, letterSpacing: 0.3 }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

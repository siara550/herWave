'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', emoji: '🏠' },
  { href: '/tracker', label: 'Tracker', emoji: '📓' },
  { href: '/calendar', label: 'Calendar', emoji: '📅' },
  { href: '/insights', label: 'Insights', emoji: '✨' },
  { href: '/profile', label: 'Profile', emoji: '👤' },
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
    <div className="min-h-screen flex flex-col">
      {/* Top header — desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 glass border-b border-purple-100/50 sticky top-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          <span>🌊</span> HerWave
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-400 hover:text-purple-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-50"
        >
          Sign out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-6">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden glass border-t border-purple-100/50 z-10">
        <div className="flex justify-around items-center py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                pathname === item.href
                  ? 'text-purple-600'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

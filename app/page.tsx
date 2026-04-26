import Link from 'next/link'
import Stars from '@/components/ui/Stars'
import MoonOrb from '@/components/ui/MoonOrb'

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #18062a 0%, #1e0738 60%, #12042a 100%)' }}
    >
      <Stars count={50} />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Moon hero */}
        <div className="flex justify-center mb-8">
          <div style={{ position: 'relative' }}>
            <MoonOrb phase={0.25} color="#c084fc" size={160} animated />
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                borderRadius: 99,
                padding: '5px 16px',
                fontSize: 12,
                color: 'white',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              🌒 Follicular Phase
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <h1
          className="text-6xl font-bold mb-3"
          style={{
            fontFamily: 'var(--font-playfair)',
            background: 'linear-gradient(135deg, #c084fc, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          HerWave
        </h1>
        <p className="text-lg font-medium mb-3" style={{ color: '#c4b5d8', fontFamily: 'var(--font-dm-sans)' }}>
          Cycle intelligence, deeply understood
        </p>
        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b5a8a', fontFamily: 'var(--font-dm-sans)' }}>
          Track your cycle, understand every phase, and get AI-powered guidance that moves with your body — every single day.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              boxShadow: '0 8px 32px rgba(219,39,119,0.4)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Start My Journey ✦
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-full font-medium transition-all"
            style={{
              border: '1px solid rgba(192,132,252,0.3)',
              color: '#c084fc',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-12">
          {['Cycle Tracking', 'AI Companion', 'Phase Education', 'Symptom Logging', 'Personalized Tips'].map((f) => (
            <span
              key={f}
              className="px-4 py-1.5 rounded-full text-sm"
              style={{
                background: 'rgba(42,16,69,0.5)',
                border: '1px solid rgba(192,132,252,0.2)',
                color: '#c4b5d8',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

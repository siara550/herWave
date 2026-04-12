import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-6 shadow-lg">
          <span className="text-3xl">🌊</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          HerWave
        </h1>
        <p className="text-xl text-purple-700/70 mb-2 font-medium">
          Cycle-syncing & women&apos;s health, powered by AI
        </p>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Track your cycle, understand your phases, and get personalized wellness insights tailored to where you are in your cycle every single day.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full border-2 border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-3 justify-center mt-16 max-w-lg">
        {['Cycle Tracking', 'AI Insights', 'Phase Calendar', 'Symptom Logging', 'Personalized Tips'].map((f) => (
          <span
            key={f}
            className="px-4 py-1.5 rounded-full bg-white/80 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

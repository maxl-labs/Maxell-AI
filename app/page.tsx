import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight text-indigo-600">Cadence</span>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-zinc-600 hover:text-zinc-900 px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Practice smarter.<br />Play better.
        </h1>
        <p className="mt-6 text-xl text-zinc-500 max-w-2xl mx-auto">
          Cadence tracks your practice sessions, streaks, and progress so you can see how far you&apos;ve come.
        </p>
        <div className="mt-10">
          <Link
            href="/sign-up"
            className="inline-block bg-indigo-600 text-white text-lg px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Start tracking free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-100">
        <h2 className="text-3xl font-bold text-center mb-14">Everything you need to stay consistent</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="bg-zinc-50 rounded-2xl p-8">
            <div className="text-2xl mb-4">🎵</div>
            <h3 className="text-lg font-semibold mb-2">Log sessions</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Track every practice session — instrument, time, and notes.
            </p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-8">
            <div className="text-2xl mb-4">🔥</div>
            <h3 className="text-lg font-semibold mb-2">Streak tracking</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Build a streak. Stay accountable.
            </p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-8">
            <div className="text-2xl mb-4">📈</div>
            <h3 className="text-lg font-semibold mb-2">Progress visibility</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              See your practice history at a glance.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-100">
        <h2 className="text-3xl font-bold text-center mb-14">Simple pricing</h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="border border-zinc-200 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-1">Free</h3>
            <p className="text-4xl font-bold mt-4 mb-6">$0<span className="text-base font-normal text-zinc-400">/mo</span></p>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> Session logging</li>
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> Streak tracking</li>
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> 30-day history</li>
            </ul>
            <Link
              href="/sign-up"
              className="mt-8 block text-center border border-indigo-600 text-indigo-600 px-4 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
            >
              Get started free
            </Link>
          </div>
          <div className="border-2 border-indigo-600 rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">Popular</span>
            <h3 className="text-lg font-semibold mb-1">Pro</h3>
            <p className="text-4xl font-bold mt-4 mb-6">$8<span className="text-base font-normal text-zinc-400">/mo</span></p>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> Unlimited history</li>
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> Advanced analytics</li>
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> CSV export</li>
            </ul>
            <Link
              href="/sign-up"
              className="mt-8 block text-center bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Start with Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-indigo-600 text-white py-20 mt-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-2xl font-semibold mb-6">
            Ready to build better practice habits?
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Sign up free
          </Link>
        </div>
      </section>
    </div>
  );
}

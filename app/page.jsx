import { redirectIfAuthenticated } from '@/utils/redirectIfAuthenticated';
import Link from 'next/link';

export default async function LandingPage() {
    await redirectIfAuthenticated();
  return (
    <main className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      {/* subtle grid / vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
      
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
        <div className="w-full max-w-3xl text-center">
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            Brainwave
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            A thoughtfully minimal, AI-assisted notes app. Sign in to start capturing ideas,
            organize with tags, and generate concise summaries.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_20px_rgba(0,0,0,0.4)] transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
            >
              Get started
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-100 backdrop-blur-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Create account
            </Link>
          </div>

          {/* tiny feature row for depth */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ['Secure by default', 'Row Level Security via Supabase Auth'],
              ['Fast & modern', 'Next.js App Router + Server Actions'],
              ['AI summaries', 'Turn long notes into quick insights'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl">
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="mt-1 text-xs text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { signup } from '../(auth)/actions';

import { redirectIfAuthenticated } from '@/utils/redirectIfAuthenticated';
import SubmitButton from '../_components/SubmitButton';

export default async function SignupPage() {
  await redirectIfAuthenticated()

  return (
    <div className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-8 py-6">
            <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-zinc-400">Start using Brainwave in seconds</p>
          </div>

          <div className="px-8 py-6">
            <form action={signup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-zinc-300">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required
                  placeholder="you@domain.com"
                  className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60 placeholder:text-zinc-500" />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm text-zinc-300">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required
                  placeholder="Create a strong password"
                  className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60 placeholder:text-zinc-500" />
              </div>

              <div className="pt-2">
                <SubmitButton pendingText="Creating account…">Create account</SubmitButton>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-zinc-400">Already have an account?</p>
                <Link href="/login" className="text-sm font-medium text-zinc-100 underline-offset-4 transition hover:underline hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40 rounded-md px-1">
                  Sign in
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-b-2xl border-t border-white/10 bg-black/20 px-8 py-4 text-xs text-zinc-500">
            By continuing you agree to our terms.
          </div>
        </div>
      </div>
    </div>
  );
}

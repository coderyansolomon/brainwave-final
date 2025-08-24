import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';
import { createClient } from '@/utils/supabase/server';
import SubmitButton from '../_components/SubmitButton';
import { createNote, deleteNote } from '../(notes)/actions';
import LogoutButton from '../_components/LogoutButton';
import Link from 'next/link';
import ConfirmButton from '../_components/ConfirmButton';



export default async function DashboardPage() {
  const user = await redirectIfNotAuthenticated();
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from('notes')
    .select('id, title, content, created_at, updated_at')
    .order('created_at', { ascending: false });

  return (
    <main className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      <section className="relative mx-auto max-w-5xl p-6">
        <header className="flex flex-col gap-2 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your Notes</h1>
            <p className="text-sm text-zinc-400">
              Signed in as <span className="text-zinc-200">{user.email}</span>
            </p>
            <LogoutButton />
          </div>
        </header>

        {/* Create Note Card */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
          <h2 className="text-base font-medium">Create a note</h2>
          <form action={createNote} className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="mb-1 block text-sm text-zinc-300">Title</label>
              <input
                id="title"
                name="title"
                required
                placeholder="Brief note title"
                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60 placeholder:text-zinc-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="content" className="mb-1 block text-sm text-zinc-300">Content</label>
              <textarea
                id="content"
                name="content"
                rows={4}
                placeholder="Optional content..."
                className="w-full resize-y rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60 placeholder:text-zinc-500"
              />
            </div>
            <div className="sm:col-span-2 pt-1">
              {SubmitButton ? (
                <SubmitButton pendingText="Saving…">Save note</SubmitButton>
              ) : (
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_20px_rgba(0,0,0,0.35)] transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                >
                  Save note
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List */}
        {!notes?.length ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-zinc-400">
            You don’t have any notes yet. Create your first one above.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl hover:bg-white/[0.06] transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/notes/${n.id}`}
                    className="text-base font-medium text-zinc-100 hover:underline underline-offset-4"
                  >
                    {n.title}
                  </Link>

                  {/* Inline delete */}
                  <form action={deleteNote}>
                    <input type="hidden" name="id" value={n.id} />
                    <ConfirmButton
                      confirmText="Delete this note?"
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20"
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>

                {n.content && (
                  <p className="mt-1 line-clamp-3 text-sm text-zinc-400 whitespace-pre-wrap">
                    {n.content}
                  </p>
                )}
                <div className="mt-3 text-xs text-zinc-500">
                  {new Date(n.updated_at || n.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

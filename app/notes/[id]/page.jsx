import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';
import { updateNote, deleteNote } from '@/app/(notes)/actions';
import SubmitButton from '@/app/_components/SubmitButton';
import ConfirmButton from '@/app/_components/ConfirmButton';



export default async function NoteDetailPage({ params }) {
  const user = await redirectIfNotAuthenticated();
  const supabase = await createClient();
  const { id } = await params;

  const { data: note } = await supabase
    .from('notes')
    .select('id, title, content, updated_at, created_at, user_id')
    .eq('id', id)
    .single();

  // RLS should already block others, but handle null
  if (!note) return notFound();
  if (note.user_id !== user.id) redirect('/dashboard');

  return (
    <main className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      <section className="relative mx-auto max-w-3xl p-6">
        <nav className="mb-4 text-sm text-zinc-400">
          <Link className="hover:text-zinc-200" href="/dashboard">← Back to Dashboard</Link>
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
          <header className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Edit note</h1>
              <p className="mt-1 text-xs text-zinc-500">
                Last updated {new Date(note.updated_at || note.created_at).toLocaleString()}
              </p>
            </div>

            {/* Delete form */}
            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <ConfirmButton
                confirmText="Delete note?"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                Delete
              </ConfirmButton>
            </form>
          </header>

          {/* Edit form */}
          <form action={updateNote} className="grid gap-4">
            <input type="hidden" name="id" value={note.id} />

            <div>
              <label htmlFor="title" className="mb-1 block text-sm text-zinc-300">Title</label>
              <input
                id="title"
                name="title"
                defaultValue={note.title}
                required
                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label htmlFor="content" className="mb-1 block text-sm text-zinc-300">Content</label>
              <textarea
                id="content"
                name="content"
                rows={8}
                defaultValue={note.content || ''}
                className="w-full resize-y rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href="/dashboard"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Cancel
              </Link>
              <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

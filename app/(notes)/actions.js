'use server';

import { createActionClient } from '@/utils/supabase/actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function createNote(formData) {
  const supabase = await createActionClient();

  // Get current user (required to set user_id and pass RLS)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();

  if (!title) {
    throw new Error('Must have title!')
  }

  const { error } = await supabase
    .from('notes')
    .insert([{ user_id: user.id, title, content }]);

  if (error) {
    throw error
  }

  revalidatePath('/dashboard');
}

export async function updateNote(formData){
  const supabase = await createActionClient();
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '');
  const content = String(formData.get('content') || '');

  if (!id || !title) redirect(`/notes/${id}`);
  await supabase.from('notes').update({title,content}).eq('id', id).eq('user_id', user.id)

  revalidatePath('dashboard');
  revalidatePath(`/notes/${id}`);
}

export async function deleteNote(formData){
  const supabase = await createActionClient();
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  if (!id) redirect('/dashboard');
  await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('dashboard');
  redirect('/dashboard');
}

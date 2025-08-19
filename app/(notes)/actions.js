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

'use server';

import { createActionClient } from '@/utils/supabase/actions';
import { redirect } from 'next/navigation';


export async function login(formData) {
  const supabase = await createActionClient();
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect('/dashboard');
}

export async function signup(formData) {
  const supabase = await createActionClient(); 
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createActionClient(); 
  await supabase.auth.signOut();
  redirect('/login');
}

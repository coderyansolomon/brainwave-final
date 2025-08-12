import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';


export async function redirectIfAuthenticated(path = '/dashboard') {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect(path);
  }
}

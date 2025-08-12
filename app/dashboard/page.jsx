import { createClient } from '@/utils/supabase/server';
import LogoutButton from '../_components/LogoutButton';
import { redirectIfNotAuthenticated } from '@/utils/redirectIfNotAuthenticated';

export default async function Dashboard() {
  await redirectIfNotAuthenticated()
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="max-w-2xl mx-auto pt-20 space-y-4">
      <div>Welcome, <b>{data.user.email}</b></div>
      <p>This page is protected by server-side auth.</p>
      <LogoutButton />
    </div>
  );
}

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createActionClient() {
  const cookieStore = await cookies(); // In actions/route handlers, this is writeable

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // NEW API — writeable
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options); // <-- writes Set-Cookie headers
          });
        },
      },
    }
  );
}

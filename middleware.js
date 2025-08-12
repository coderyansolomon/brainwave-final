import { updateSession } from './utils/supabase/middleware';

export async function middleware(request) {
  return updateSession(request);
}

export const config = {
  matcher: ['/(.*)'], // simple + supported; skip assets in code if you want
};

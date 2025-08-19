-- Table
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table notes enable row level security;

-- Read own notes
create policy "read own notes" on notes
for select to authenticated
using (auth.uid() = user_id);

-- Insert/update/delete own notes
create policy "modify own notes" on notes
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Trigger to keep updated_at fresh (optional but nice)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;

$$ language plpgsql;

drop trigger if exists trg_set_updated_at on notes;
create trigger trg_set_updated_at
before update on notes
for each row execute function public.set_updated_at();

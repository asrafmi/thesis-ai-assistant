-- Add monthly diagram count tracking to profiles
alter table public.profiles
  add column if not exists diagram_count int not null default 0,
  add column if not exists diagram_count_reset_at timestamptz;

-- Add monthly word count reset tracking to profiles
alter table public.profiles
  add column if not exists word_count_reset_at timestamptz;

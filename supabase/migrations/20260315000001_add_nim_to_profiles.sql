-- Add NIM (student ID number) to profiles
alter table public.profiles add column if not exists nim text;

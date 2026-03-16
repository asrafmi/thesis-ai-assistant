-- Add reference_style to theses for per-thesis citation format preference
create type public.reference_style as enum ('apa', 'ieee', 'mendeley');

alter table public.theses
  add column reference_style public.reference_style not null default 'apa';

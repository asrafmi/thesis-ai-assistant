-- ============================================================
-- References: stores cached academic references per thesis
-- ============================================================

create table public.references (
  id              uuid primary key default gen_random_uuid(),
  thesis_id       uuid not null references public.theses (id) on delete cascade,
  title           text not null,
  authors         text,
  year            int,
  journal         text,
  volume          text,
  issue           text,
  pages           text,
  url             text,
  doi             text,
  citation_number int not null,
  created_at      timestamptz not null default now()
);

alter table public.references enable row level security;

create policy "Users can manage references of own theses"
  on public.references for all
  using (
    exists (
      select 1 from public.theses
      where theses.id = references.thesis_id
        and theses.user_id = auth.uid()
    )
  );

create index references_thesis_id_idx on public.references (thesis_id);

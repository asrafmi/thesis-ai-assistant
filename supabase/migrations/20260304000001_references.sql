-- ============================================================
-- Thesis References: stores cached academic references per thesis
-- Note: "references" is a reserved keyword in PostgreSQL, so we
-- use "thesis_references" as the table name.
-- ============================================================

create table public.thesis_references (
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

alter table public.thesis_references enable row level security;

create policy "Users can manage references of own theses"
  on public.thesis_references for all
  using (
    exists (
      select 1 from public.theses
      where theses.id = thesis_references.thesis_id
        and theses.user_id = auth.uid()
    )
  );

create index thesis_references_thesis_id_idx on public.thesis_references (thesis_id);

-- ============================================================
-- Initial Schema: SkripsiAI
-- ============================================================

-- Enums
create type public.plan as enum ('free', 'pro');
create type public.template_type as enum ('quantitative', 'qualitative');
create type public.thesis_status as enum ('draft', 'complete');
create type public.revision_source as enum ('ai', 'user');


-- ============================================================
-- profiles
-- Extends auth.users. Created automatically on user signup.
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  plan        public.plan not null default 'free',
  word_count  int not null default 0
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- theses
-- One thesis per user for MVP.
-- ============================================================
create table public.theses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  title         text not null,
  university    text,
  faculty       text,
  supervisor    text,
  year          int,
  template_type public.template_type not null default 'quantitative',
  status        public.thesis_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.theses enable row level security;

create policy "Users can manage own theses"
  on public.theses for all
  using (auth.uid() = user_id);

create index theses_user_id_idx on public.theses (user_id);


-- ============================================================
-- sections
-- Self-referential tree. parent_id null = root (bab).
-- level: 1=Bab, 2=Subbab, 3=Sub-subbab
-- ============================================================
create table public.sections (
  id          uuid primary key default gen_random_uuid(),
  thesis_id   uuid not null references public.theses (id) on delete cascade,
  parent_id   uuid references public.sections (id) on delete cascade,
  title       text not null,
  content     jsonb,
  level       int not null,
  order_index int not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.sections enable row level security;

create policy "Users can manage sections of own theses"
  on public.sections for all
  using (
    exists (
      select 1 from public.theses
      where theses.id = sections.thesis_id
        and theses.user_id = auth.uid()
    )
  );

create index sections_thesis_id_idx on public.sections (thesis_id);
create index sections_parent_id_idx on public.sections (parent_id);


-- ============================================================
-- revisions
-- Snapshot history per section. Immutable after insert.
-- ============================================================
create table public.revisions (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references public.sections (id) on delete cascade,
  content     jsonb not null,
  source      public.revision_source not null,
  created_at  timestamptz not null default now()
);

alter table public.revisions enable row level security;

create policy "Users can view revisions of own sections"
  on public.revisions for select
  using (
    exists (
      select 1 from public.sections
      join public.theses on theses.id = sections.thesis_id
      where sections.id = revisions.section_id
        and theses.user_id = auth.uid()
    )
  );

create policy "Users can insert revisions for own sections"
  on public.revisions for insert
  with check (
    exists (
      select 1 from public.sections
      join public.theses on theses.id = sections.thesis_id
      where sections.id = revisions.section_id
        and theses.user_id = auth.uid()
    )
  );

create index revisions_section_id_idx on public.revisions (section_id);


-- ============================================================
-- exports
-- Tracks export history for freemium limits.
-- ============================================================
create table public.exports (
  id         uuid primary key default gen_random_uuid(),
  thesis_id  uuid not null references public.theses (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  file_url   text not null,
  created_at timestamptz not null default now()
);

alter table public.exports enable row level security;

create policy "Users can manage own exports"
  on public.exports for all
  using (auth.uid() = user_id);

create index exports_user_id_idx on public.exports (user_id);
create index exports_thesis_id_idx on public.exports (thesis_id);

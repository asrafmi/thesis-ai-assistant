When adding a new Supabase migration:

1. File naming: supabase/migrations/YYYYMMDDHHMMSS_description.sql
   (use current date in format 20260304, increment seconds if multiple same day)

2. Structure order:
   a. Enums first (before tables that reference them)
   b. Create table
   c. Enable RLS immediately: alter table public.<name> enable row level security;
   d. Add policies using auth.uid()
   e. Add indexes on all foreign keys

3. Standard patterns:
   - Primary key: id uuid primary key default gen_random_uuid()
   - Timestamps: created_at timestamptz not null default now()
   - FK: references public.<table> (id) on delete cascade
   - RLS policy: using (auth.uid() = user_id)

4. After writing migration, regenerate TypeScript types:
   npx supabase gen types typescript --local > src/types/database.types.ts

Example:
```sql
-- ============================================================
-- <feature_name>
-- ============================================================
create table public.<table_name> (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  title      text not null,
  created_at timestamptz not null default now()
);

alter table public.<table_name> enable row level security;

create policy "Users can manage own <table_name>"
  on public.<table_name> for all
  using (auth.uid() = user_id);

create index <table_name>_user_id_idx on public.<table_name> (user_id);
```

Reference: supabase/migrations/20260304000000_initial_schema.sql

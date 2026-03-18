-- ============================================================
-- transactions
-- Tracks Midtrans payment transactions for plan upgrades.
-- ============================================================
create type public.transaction_status as enum ('pending', 'settlement', 'expire', 'cancel', 'deny', 'refund');

create table public.transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  order_id        text not null unique,
  snap_token      text not null,
  amount          int not null,
  status          public.transaction_status not null default 'pending',
  payment_type    text,
  midtrans_response jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_order_id_idx on public.transactions (order_id);

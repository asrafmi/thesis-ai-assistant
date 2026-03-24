-- ============================================================
-- Manual payment requests (replaces Midtrans flow)
-- ============================================================

-- Status enum for payment requests
create type payment_request_status as enum ('pending', 'approved', 'rejected');

-- Payment requests table
create table payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan text not null check (plan in ('starter', 'full')),
  amount int not null,
  proof_image_url text not null,
  status payment_request_status not null default 'pending',
  reject_reason text,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Indexes
create index idx_payment_requests_user on payment_requests(user_id);
create index idx_payment_requests_status on payment_requests(status);

-- RLS
alter table payment_requests enable row level security;

-- Users can view their own requests
create policy "Users can view own payment requests"
  on payment_requests for select
  to authenticated
  using (user_id = auth.uid());

-- Users can insert their own requests
create policy "Users can create payment requests"
  on payment_requests for insert
  to authenticated
  with check (user_id = auth.uid());

-- Storage bucket for payment proofs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  true,
  5242880,  -- 5 MB
  '{image/jpeg,image/png,image/webp}'
)
on conflict (id) do nothing;

create policy "Authenticated users can upload payment proofs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'payment-proofs');

create policy "Public read access for payment proofs"
  on storage.objects for select
  to public
  using (bucket_id = 'payment-proofs');

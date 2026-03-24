-- Add plan expiry date to profiles
alter table profiles add column plan_expires_at timestamptz;

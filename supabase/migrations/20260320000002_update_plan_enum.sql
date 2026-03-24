-- Add 'starter' and 'full' values to the plan enum, remove 'pro'
ALTER TYPE plan ADD VALUE IF NOT EXISTS 'starter';
ALTER TYPE plan ADD VALUE IF NOT EXISTS 'full';

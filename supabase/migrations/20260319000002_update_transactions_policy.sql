create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- Supabase Storage: thesis-images bucket for editor images
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'thesis-images',
  'thesis-images',
  true,
  5242880,  -- 5 MB
  '{image/jpeg,image/png,image/gif,image/webp}'
)
on conflict (id) do nothing;

-- Authenticated users can upload images
create policy "Authenticated users can upload thesis images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'thesis-images');

-- Anyone can read (images are embedded in the document)
create policy "Public read access for thesis images"
  on storage.objects for select
  to public
  using (bucket_id = 'thesis-images');

-- Authenticated users can delete their own uploads
create policy "Authenticated users can delete thesis images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'thesis-images');

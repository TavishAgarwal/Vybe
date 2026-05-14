-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase Storage: create public videos bucket
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'videos',
  'videos',
  true,
  104857600, -- 100 MB
  array['video/mp4', 'video/quicktime']
)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder
create policy "Users can upload own videos"
  on storage.objects for insert
  with check (
    bucket_id = 'videos'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access to all videos
create policy "Videos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'videos');

-- Allow users to delete their own videos
create policy "Users can delete own videos"
  on storage.objects for delete
  using (
    bucket_id = 'videos'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

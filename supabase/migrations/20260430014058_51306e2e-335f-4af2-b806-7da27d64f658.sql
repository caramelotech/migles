-- Add cover_url and location_type to events
DO $$ BEGIN
  CREATE TYPE public.event_location_type AS ENUM ('in_person', 'online');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS cover_url text,
  ADD COLUMN IF NOT EXISTS location_type public.event_location_type NOT NULL DEFAULT 'in_person';

ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS cover_url text;

-- Storage bucket for cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "Covers are publicly viewable" ON storage.objects;
CREATE POLICY "Covers are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

-- Authenticated users can upload to their own folder
DROP POLICY IF EXISTS "Users can upload their own covers" ON storage.objects;
CREATE POLICY "Users can upload their own covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'covers'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own covers" ON storage.objects;
CREATE POLICY "Users can update their own covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'covers'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own covers" ON storage.objects;
CREATE POLICY "Users can delete their own covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'covers'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
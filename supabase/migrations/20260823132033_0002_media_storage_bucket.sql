/*
# Create media storage bucket

1. Storage
- Creates a public storage bucket named `media` for event, portfolio, testimonial, and CMS images.
- Sets the bucket to public so images are readable without signed URLs.
*/
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of media bucket objects
DROP POLICY IF EXISTS "media_bucket_public_read" ON storage.objects;
CREATE POLICY "media_bucket_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

-- Allow staff/admin to upload/update/delete in media bucket
DROP POLICY IF EXISTS "media_bucket_staff_upload" ON storage.objects;
CREATE POLICY "media_bucket_staff_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_staff());

DROP POLICY IF EXISTS "media_bucket_staff_update" ON storage.objects;
CREATE POLICY "media_bucket_staff_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_staff())
  WITH CHECK (bucket_id = 'media' AND public.is_staff());

DROP POLICY IF EXISTS "media_bucket_staff_delete" ON storage.objects;
CREATE POLICY "media_bucket_staff_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_staff());

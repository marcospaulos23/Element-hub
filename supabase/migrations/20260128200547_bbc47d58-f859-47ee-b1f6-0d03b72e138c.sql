-- Drop existing permissive storage policies on element-previews bucket
DROP POLICY IF EXISTS "Anyone can upload element previews" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete element previews" ON storage.objects;

-- Create admin-only upload policy for element-previews
CREATE POLICY "Only admin can upload element previews"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'element-previews' AND
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);

-- Create admin-only delete policy for element-previews
CREATE POLICY "Only admin can delete element previews"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'element-previews' AND
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);
-- Create storage bucket for element preview images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('element-previews', 'element-previews', true);

-- Allow anyone to view element preview images (public bucket)
CREATE POLICY "Anyone can view element previews"
ON storage.objects FOR SELECT
USING (bucket_id = 'element-previews');

-- Allow anyone to upload element preview images
CREATE POLICY "Anyone can upload element previews"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'element-previews');

-- Allow anyone to delete element preview images
CREATE POLICY "Anyone can delete element previews"
ON storage.objects FOR DELETE
USING (bucket_id = 'element-previews');
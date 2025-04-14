
-- Create a storage bucket for blog images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'Blog Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to view blog images
CREATE POLICY "Public Access to Blog Images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'blog-images')
ON CONFLICT DO NOTHING;

-- Create policy to allow authenticated users to insert blog images
CREATE POLICY "Allow Authenticated Users to Upload Blog Images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'blog-images')
ON CONFLICT DO NOTHING;

-- Create policy to allow authenticated users to update their own blog images
CREATE POLICY "Allow Authenticated Users to Update Their Blog Images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'blog-images' AND auth.uid() = owner)
ON CONFLICT DO NOTHING;

-- Create policy to allow authenticated users to delete their own blog images
CREATE POLICY "Allow Authenticated Users to Delete Their Blog Images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'blog-images' AND auth.uid() = owner)
ON CONFLICT DO NOTHING;

-- Add some performance optimizations for image storage
ALTER STORAGE.buckets 
SET public_url_transform_config = 
  '{"max-age": 604800, "stale-while-revalidate": 86400}'
WHERE name = 'blog-images';

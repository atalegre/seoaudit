
import { supabase } from '@/integrations/supabase/client';

// Function to upload a blog image to Supabase storage
export const uploadBlogImage = async (file: File): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `blog-image-${timestamp}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading image to Supabase storage:', {
      fileName,
      contentType: file.type,
      size: file.size
    });

    // Check if the blog-images bucket exists, create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'blog-images');
    
    if (!bucketExists) {
      console.log('Creating blog-images bucket');
      await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
    }

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting existing files
      });

    if (error) {
      console.error('Error uploading image to Supabase:', error);
      throw error;
    }

    console.log('Image uploaded successfully:', data);

    // Generate the public URL - ensuring we get a fresh URL
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadBlogImage:', error);
    throw error;
  }
};

// Generate a thematic image URL based on title and category
export const generateThematicImageUrl = (title: string, category?: string): string => {
  const searchQuery = `${category || ''} ${title}`.trim();
  const encodedQuery = encodeURIComponent(searchQuery);
  const timestamp = new Date().getTime(); // Add timestamp to avoid caching
  return `https://source.unsplash.com/featured/1200x800/?${encodedQuery}&t=${timestamp}`;
};


import { supabase } from '@/integrations/supabase/client';

// Function to upload a blog image to Supabase storage
export const uploadBlogImage = async (file: File): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `blog-image-${timestamp}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Construct public URL
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${filePath}`;
    return imageUrl;
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

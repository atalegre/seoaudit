
import { BlogPost } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';

// Blog posts table operations
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('Fetching blog posts from Supabase...');
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
    
    console.log('Blog posts data received:', data);
    return data as BlogPost[] || [];
  } catch (error) {
    console.error('Exception in getBlogPosts:', error);
    throw error;
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  
  return data as BlogPost;
};

export const createBlogPost = async (post: BlogPost): Promise<void> => {
  // Ensure tags is always an array before sending to Supabase
  const formattedPost = {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : post.tags?.split(',').map(tag => tag.trim()) || []
  };

  const { error } = await supabase
    .from('blog_posts')
    .insert([formattedPost]);
  
  if (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, post: BlogPost): Promise<void> => {
  // Ensure tags is always an array before sending to Supabase
  const formattedPost = {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : post.tags?.split(',').map(tag => tag.trim()) || []
  };

  const { error } = await supabase
    .from('blog_posts')
    .update(formattedPost)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

export const uploadBlogImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

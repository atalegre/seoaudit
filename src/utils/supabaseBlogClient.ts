
import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '@/types/blog';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vwtracpgzdqrowvjmizi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dHJhY3BnemRxcm93dmptaXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDA4ODIsImV4cCI6MjA1OTA3Njg4Mn0.WC6DrG_ftze64gQVajR-n1vjfjMqA_ADP_hyTShQckA";

// Create a Supabase client for blog operations
export const blogClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Blog posts table operations
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('Fetching blog posts from Supabase...');
  try {
    const { data, error } = await blogClient
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
  const { data, error } = await blogClient
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
  const { error } = await blogClient
    .from('blog_posts')
    .insert([post]);
  
  if (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, post: BlogPost): Promise<void> => {
  const { error } = await blogClient
    .from('blog_posts')
    .update(post)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await blogClient
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
    const { error: uploadError } = await blogClient.storage
      .from('blog-images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: publicUrlData } = blogClient.storage
      .from('blog-images')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

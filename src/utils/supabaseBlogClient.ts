
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { createBlogPost as createPost } from '@/utils/blog/postOperations';

// Get all blog posts from Supabase
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    return data as unknown as BlogPost[];
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
};

// Get a specific blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }

    return data as unknown as BlogPost;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
};

// Re-export the createBlogPost function from postOperations
export { createPost as createBlogPost };

// Re-export the optimized blog posts creation function
export { createOptimizedBlogPosts } from '@/services/blog/articleGenerationService';

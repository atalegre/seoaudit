
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

// Function to create a new blog post in Supabase
export const createBlogPost = async (post: BlogPost): Promise<BlogPost | null> => {
  try {
    // Ensure tags is always an array
    const formattedPost = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      key_learning: post.keyLearning,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags : [],
      image_src: post.imageSrc,
      popularity: post.popularity,
      date: post.date,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([formattedPost] as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data as unknown as BlogPost;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    return null;
  }
};

// Function to update an existing blog post in Supabase
export const updateBlogPost = async (id: string, post: BlogPost): Promise<BlogPost | null> => {
  try {
    // Ensure tags is always an array
    const formattedPost = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      key_learning: post.keyLearning,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags : [],
      image_src: post.imageSrc,
      popularity: post.popularity,
      date: post.date,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .update(formattedPost as any)
      .eq('id', id as any)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data as unknown as BlogPost;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    return null;
  }
};

// Function to delete a blog post from Supabase
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id as any);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    return false;
  }
};

// Function to retrieve all blog posts from Supabase
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

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

// Function to get a single blog post by slug from Supabase
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug as any)
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

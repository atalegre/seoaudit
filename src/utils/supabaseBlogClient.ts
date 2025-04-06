import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { TablesInsert } from '@/integrations/supabase/types';

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
      .insert([formattedPost])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data as BlogPost;
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
      .update(formattedPost)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data as BlogPost;
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
      .eq('id', id);

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

    return data as BlogPost[];
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
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }

    return data as BlogPost;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
};

// Function to create SEO optimized blog posts
export const createOptimizedBlogPosts = async (): Promise<boolean> => {
  console.log('Creating SEO optimized blog posts...');
  
  try {
    // Create array of optimized blog posts
    const optimizedPosts = [
      {
        title: 'The Future of AI in Digital Marketing',
        slug: 'future-of-ai-in-digital-marketing',
        excerpt: 'Explore how AI is revolutionizing digital marketing strategies and creating new opportunities for businesses.',
        content: 'AI is transforming digital marketing...',
        keyLearning: 'AI drives efficiency and personalization in marketing.',
        category: 'Marketing',
        tags: ['AI', 'digital marketing', 'SEO'],
        imageSrc: 'https://source.unsplash.com/random/1200x800/?ai',
        popularity: 0,
        date: new Date().toISOString(),
      },
      {
        title: 'Top 5 SEO Techniques for 2024',
        slug: 'top-5-seo-techniques-for-2024',
        excerpt: 'Stay ahead of the curve with the latest SEO techniques that will dominate search engine rankings in 2024.',
        content: 'SEO is constantly evolving...',
        keyLearning: 'Adapt to new SEO algorithms for better visibility.',
        category: 'SEO',
        tags: ['SEO', 'techniques', '2024'],
        imageSrc: 'https://source.unsplash.com/random/1200x800/?seo',
        popularity: 0,
        date: new Date().toISOString(),
      },
      {
        title: 'How to Build a Successful Content Strategy',
        slug: 'how-to-build-a-successful-content-strategy',
        excerpt: 'Learn the essential steps to create a content strategy that drives engagement and achieves business goals.',
        content: 'Content is king...',
        keyLearning: 'A well-planned content strategy is crucial for success.',
        category: 'Content Marketing',
        tags: ['content strategy', 'marketing', 'engagement'],
        imageSrc: 'https://source.unsplash.com/random/1200x800/?content',
        popularity: 0,
        date: new Date().toISOString(),
      },
      {
        title: 'The Power of Social Media Marketing',
        slug: 'the-power-of-social-media-marketing',
        excerpt: 'Discover how social media marketing can amplify your brand and connect with your audience on a deeper level.',
        content: 'Social media is a powerful tool...',
        keyLearning: 'Social media enhances brand reach and customer engagement.',
        category: 'Social Media',
        tags: ['social media', 'marketing', 'branding'],
        imageSrc: 'https://source.unsplash.com/random/1200x800/?social',
        popularity: 0,
        date: new Date().toISOString(),
      },
      {
        title: 'Email Marketing Best Practices',
        slug: 'email-marketing-best-practices',
        excerpt: 'Optimize your email marketing campaigns with these best practices to improve open rates and conversions.',
        content: 'Email marketing is still relevant...',
        keyLearning: 'Effective email marketing drives conversions and ROI.',
        category: 'Email Marketing',
        tags: ['email marketing', 'best practices', 'conversions'],
        imageSrc: 'https://source.unsplash.com/random/1200x800/?email',
        popularity: 0,
        date: new Date().toISOString(),
      }
    ];
    
    // Process each post individually to ensure proper tag formatting
    for (const post of optimizedPosts) {
      // Ensure tags is always an array of strings
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
      
      // Insert each post individually
      const { error } = await supabase
        .from('blog_posts')
        .insert(formattedPost);
        
      if (error) {
        console.error('Error creating optimized blog post:', error);
        throw error;
      }
    }
    
    console.log('All optimized blog posts created successfully');
    return true;
  } catch (error) {
    console.error('Exception in createOptimizedBlogPosts:', error);
    return false;
  }
};


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

// Generate a thematic image URL based on title and category
export const generateThematicImageUrl = (title: string, category?: string): string => {
  const searchQuery = `${category || ''} ${title}`.trim();
  const encodedQuery = encodeURIComponent(searchQuery);
  const timestamp = new Date().getTime(); // Add timestamp to avoid caching
  return `https://source.unsplash.com/featured/1200x800/?${encodedQuery}&t=${timestamp}`;
};

// Function to create SEO optimized blog posts
export const createOptimizedBlogPosts = async (): Promise<boolean> => {
  console.log('Creating SEO optimized blog posts...');
  
  try {
    // Define topics for each post to create thematic images
    const topics = [
      { title: 'The Future of AI in Digital Marketing', category: 'AI' },
      { title: 'Top 5 SEO Techniques for 2024', category: 'SEO' },
      { title: 'How to Build a Successful Content Strategy', category: 'Content Marketing' },
      { title: 'The Power of Social Media Marketing', category: 'Social Media' },
      { title: 'Email Marketing Best Practices', category: 'Email Marketing' }
    ];
    
    // Create array of optimized blog posts with unique thematic images for each
    const optimizedPosts = topics.map(topic => {
      // Generate a unique, thematic image for each post
      const imageUrl = generateThematicImageUrl(topic.title, topic.category);
      
      return {
        title: topic.title,
        slug: topic.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
        excerpt: generateExcerpt(topic.title, topic.category),
        content: generateContent(topic.title, topic.category),
        keyLearning: generateKeyLearning(topic.category),
        category: topic.category,
        tags: generateTags(topic.category),
        imageSrc: imageUrl,
        popularity: 0,
        date: new Date().toISOString(),
      };
    });
    
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
        .insert(formattedPost as any);
        
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

// Helper functions for generating content
function generateExcerpt(title: string, category: string): string {
  const excerpts: Record<string, string[]> = {
    'AI': [
      'Explore how AI is revolutionizing digital marketing strategies and creating new opportunities for businesses.',
      'Discover the latest AI advancements transforming the digital marketing landscape.',
      'Learn how artificial intelligence is reshaping marketing strategies and customer engagement.'
    ],
    'SEO': [
      'Stay ahead of the curve with the latest SEO techniques that will dominate search engine rankings.',
      'Master the most effective SEO strategies to boost your website\'s visibility and organic traffic.',
      'Discover proven SEO methods that will help your content rank higher in search results.'
    ],
    'Content Marketing': [
      'Learn the essential steps to create a content strategy that drives engagement and achieves business goals.',
      'Develop a powerful content strategy that connects with your audience and delivers measurable results.',
      'Build a comprehensive content plan that aligns with your business objectives and resonates with your target market.'
    ],
    'Social Media': [
      'Discover how social media marketing can amplify your brand and connect with your audience on a deeper level.',
      'Leverage the power of social platforms to expand your reach and build meaningful customer relationships.',
      'Unlock the potential of social media to transform your brand presence and engagement metrics.'
    ],
    'Email Marketing': [
      'Optimize your email marketing campaigns with these best practices to improve open rates and conversions.',
      'Enhance your email strategies to drive higher engagement and conversion rates from your subscribers.',
      'Master the art of effective email marketing to nurture leads and maximize customer retention.'
    ]
  };

  // Get random excerpt from the appropriate category or use a default one
  const categoryExcerpts = excerpts[category] || excerpts['Content Marketing'];
  return categoryExcerpts[Math.floor(Math.random() * categoryExcerpts.length)];
}

function generateContent(title: string, category: string): string {
  return `<h2>Introduction to ${category}</h2>
<p>${title} is a critical topic for modern businesses looking to thrive in the digital landscape. This article explores key strategies and best practices.</p>
<h2>Key Strategies</h2>
<p>Implementing effective ${category} strategies requires careful planning and execution. Here are some approaches that have proven successful:</p>
<ul>
  <li>Develop a comprehensive understanding of your target audience</li>
  <li>Create valuable and relevant content that addresses specific needs</li>
  <li>Regularly analyze performance metrics and adjust your strategy accordingly</li>
  <li>Stay updated with the latest trends and technologies in ${category}</li>
</ul>
<h2>Implementation Steps</h2>
<p>Follow these steps to implement a successful ${category} strategy:</p>
<ol>
  <li>Conduct thorough research on your industry and competitors</li>
  <li>Define clear goals and key performance indicators (KPIs)</li>
  <li>Develop a detailed action plan with specific tasks and timelines</li>
  <li>Allocate appropriate resources for implementation</li>
  <li>Continuously monitor results and make necessary adjustments</li>
</ol>
<h2>Conclusion</h2>
<p>Effective ${category} is essential for businesses aiming to establish a strong online presence and drive growth. By following these guidelines and continuously refining your approach, you can achieve significant improvements in your digital marketing efforts.</p>`;
}

function generateKeyLearning(category: string): string {
  return `<ul>
  <li>Understanding the fundamentals of ${category} is crucial for digital success</li>
  <li>A strategic approach to ${category} yields better results than ad-hoc efforts</li>
  <li>Regular analysis and optimization are key components of an effective ${category} strategy</li>
  <li>Staying updated with industry trends helps maintain a competitive edge in ${category}</li>
</ul>`;
}

function generateTags(category: string): string[] {
  const commonTags = ['digital marketing', 'strategy', 'optimization'];
  const categoryTags: Record<string, string[]> = {
    'AI': ['artificial intelligence', 'machine learning', 'automation'],
    'SEO': ['search engine optimization', 'keywords', 'ranking'],
    'Content Marketing': ['content strategy', 'storytelling', 'engagement'],
    'Social Media': ['social platforms', 'community building', 'engagement'],
    'Email Marketing': ['email campaigns', 'newsletters', 'conversion']
  };
  
  return [...(categoryTags[category] || []), ...commonTags].slice(0, 5);
}

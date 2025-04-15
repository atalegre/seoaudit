
import { BlogPost } from '@/types/blog';
import { generateSEOBlogPosts } from './blogPostService';
import { generateEcommercePost } from './ecommercePostService';
import { generateMarketingPost } from './marketingPostService';
import { generateThematicImageUrl } from '@/utils/blog/imageUtils';

// Create a batch of optimized blog posts
export const createOptimizedBlogPosts = async (): Promise<boolean> => {
  try {
    // Generate base SEO blog posts
    const seoResult = await generateSEOBlogPosts();
    
    // Generate an e-commerce post
    const ecommercePost = await generateEcommercePost('Online', 'Fashion');
    
    // Generate a marketing post
    const marketingPost = await generateMarketingPost('Small Business', 'Digital Marketing');
    
    return seoResult && !!ecommercePost && !!marketingPost;
  } catch (error) {
    console.error('Error creating optimized blog posts:', error);
    return false;
  }
};

// Generate a thematic blog post with a relevant image
export const generateThematicBlogPost = async (topic: string, category: string): Promise<BlogPost | null> => {
  try {
    // For now, we'll use the marketing post generator for thematic posts
    return await generateMarketingPost(category, topic);
  } catch (error) {
    console.error('Error generating thematic blog post:', error);
    return null;
  }
};

// Get a blog image for a specific topic and category
export const getBlogImage = async (topic: string, category: string): Promise<string> => {
  return generateThematicImageUrl(topic, category);
};

// For compatibility with other files, these exports are now handled differently
// We no longer re-export these here to avoid conflicts

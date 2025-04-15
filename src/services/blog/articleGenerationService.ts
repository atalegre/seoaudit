
import { BlogPost } from '@/types/blog';
import { generateSEOBlogPosts } from './blogPostService';
import { generateEcommercePost } from './ecommercePostService';
import { generateMarketingPost } from './marketingPostService';

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

// For compatibility with imports expecting other names
export { generateEcommercePost as generateEcommercePosts };
export { generateMarketingPost as generateMarketingDigitalPosts };

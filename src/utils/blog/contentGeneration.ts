
// This file now re-exports from the services to avoid duplication
// while maintaining backward compatibility for any existing imports

import { 
  createOptimizedBlogPosts,
  generateThematicBlogPost,
  getBlogImage
} from '@/services/blog/articleGenerationService';

export {
  createOptimizedBlogPosts,
  generateThematicBlogPost,
  getBlogImage
};

// Note: The original implementation has been moved to articleGenerationService.ts
// to centralize these functions and avoid code duplication

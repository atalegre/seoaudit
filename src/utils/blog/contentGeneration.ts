
// This file contains utility functions for generating blog content
import { BlogPost } from '@/types/blog';

export const generateThematicBlogPost = (topic: string, category: string): Partial<BlogPost> => {
  // This is a simplified mock function that would be expanded with real AI content generation
  const slug = topic.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  
  return {
    slug,
    title: topic,
    category,
    date: new Date().toISOString(),
    excerpt: `Artigo sobre ${topic} na categoria ${category}`,
    popularity: Math.floor(Math.random() * 100)
  };
};

export const getBlogImage = (category: string): string => {
  // Return themed images based on category
  const images = {
    'SEO': [
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2874&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=3174&auto=format&fit=crop'
    ],
    'AIO': [
      'https://images.unsplash.com/photo-1677442136019-21780ecad495?q=80&w=2832&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2874&auto=format&fit=crop'
    ],
    'IA': [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2874&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1677442136019-21780ecad495?q=80&w=2832&auto=format&fit=crop'
    ],
    'Marketing Digital': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=3115&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2874&auto=format&fit=crop'
    ],
    'E-commerce': [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=3270&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=3270&auto=format&fit=crop'
    ],
    'default': [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=3172&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=3270&auto=format&fit=crop'
    ]
  };
  
  const categoryImages = images[category as keyof typeof images] || images.default;
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

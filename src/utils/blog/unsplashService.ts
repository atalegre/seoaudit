import { supabase } from '@/integrations/supabase/client';

// Unsplash API configuration
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = 'xzK4bLwEXC7hsly8DxFLKuh5Gym0CncLe1HCfihQC9M';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

export const searchUnsplashImages = async (
  query: string,
  count: number = 3
): Promise<UnsplashImage[]> => {
  try {
    // Validate API key
    if (!UNSPLASH_ACCESS_KEY) {
      console.error('Unsplash API key not found');
      return [];
    }

    const params = new URLSearchParams({
      query: query,
      per_page: count.toString(),
      orientation: 'landscape',
    });

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
};

/**
 * Generate search terms from blog post content
 * @param title - Blog post title
 * @param category - Blog post category
 * @param content - Blog post content
 * @returns Formatted search query for Unsplash
 */
export const generateSearchTerms = (
  title: string,
  category?: string,
  content?: string
): string => {
  // Start with title and category
  let terms = `${title} ${category || ''}`.trim();

  // If content is provided, extract potential keywords
  if (content) {
    // Extract first few sentences for context
    const firstParagraph = content.split('\n')[0];
    const firstSentences = firstParagraph.split('.').slice(0, 2).join('.');

    // Simple keyword extraction - get longer words that might be important
    const keywords = firstSentences
      .split(' ')
      .filter(word => word.length > 5)
      .slice(0, 3)
      .join(' ');

    if (keywords) {
      terms = `${terms} ${keywords}`.trim();
    }
  }

  return terms;
};

/**
 * Get attribution text for an Unsplash image
 * @param image - Unsplash image object
 * @returns Attribution text in format "Photo by [name] on Unsplash"
 */
export const getUnsplashAttribution = (image: UnsplashImage): string => {
  return `Photo by ${image.user.name} on Unsplash`;
};

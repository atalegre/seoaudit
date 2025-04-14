import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  count: number = 3,
  page: number = 1
): Promise<UnsplashImage[]> => {
  try {
    // Validate API key
    if (!UNSPLASH_ACCESS_KEY) {
      console.error('Unsplash API key not found');
      return [];
    }

    console.log(`Searching Unsplash for: "${query}" (${count} images, page ${page})`);
    
    const params = new URLSearchParams({
      query: query,
      per_page: count.toString(),
      page: page.toString(),
      orientation: 'landscape',
    });

    const url = `${UNSPLASH_API_URL}/search/photos?${params.toString()}`;
    console.log(`Fetching from Unsplash URL: ${url}`);
    
    const response = await fetch(
      url,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        cache: 'no-store', // Ensure no caching
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Unsplash API error (${response.status}):`, errorText);
      throw new Error(`Unsplash API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Unsplash returned ${data.results?.length || 0} images`);
    
    if (!data.results || data.results.length === 0) {
      console.log('No images found on Unsplash for this query');
    }
    
    return data.results || [];
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    toast.error(`Erro ao buscar imagens: ${error.message || 'Falha na API do Unsplash'}`);
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

  // Clean up any HTML tags that might have been included
  terms = terms.replace(/<[^>]*>/g, '');
  
  console.log(`Generated Unsplash search terms: "${terms}"`);
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

/**
 * Fallback method to get a random image from Unsplash's source.unsplash.com service
 * This doesn't use the API key and has less restrictions
 */
export const getRandomUnsplashImage = (query: string): string => {
  const encodedQuery = encodeURIComponent(query.replace(/<[^>]*>/g, ''));
  const timestamp = new Date().getTime(); // Add timestamp to avoid caching
  return `https://source.unsplash.com/random/1200x800/?${encodedQuery}&t=${timestamp}`;
};

// Cache of previously used topics to avoid repetition
let previousTopics: string[] = [];

/**
 * Get a truly random image from Unsplash with varied topics
 */
export const getTrulyRandomUnsplashImage = (): string => {
  const allTopics = [
    'business', 'marketing', 'technology', 'social media', 'computer', 
    'design', 'creative', 'office', 'website', 'innovation', 'digital', 
    'workspace', 'professional', 'meeting', 'conference', 'presentation',
    'strategy', 'growth', 'development', 'success', 'teamwork', 
    'collaboration', 'brainstorming', 'ideas', 'planning', 'startup',
    'entrepreneur', 'analysis', 'research', 'data', 'communication',
    'network', 'connection', 'modern', 'urban', 'corporate', 'finance'
  ];
  
  // Filter out previously used topics if possible
  const availableTopics = allTopics.filter(topic => !previousTopics.includes(topic));
  
  // If we've used all topics, reset the cache
  if (availableTopics.length === 0) {
    previousTopics = [];
  }
  
  // Select a random topic from available ones
  const randomTopic = availableTopics.length > 0 
    ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
    : allTopics[Math.floor(Math.random() * allTopics.length)];
  
  // Add to the cache of used topics
  previousTopics.push(randomTopic);
  
  // Keep cache size manageable
  if (previousTopics.length > 10) {
    previousTopics.shift(); // Remove oldest topic
  }
  
  console.log(`Getting truly random image with topic: ${randomTopic}`);
  
  // Create unique URL with current timestamp to avoid browser caching
  const timestamp = new Date().getTime();
  const randomizer = Math.floor(Math.random() * 1000); // Add extra randomness
  
  return `https://source.unsplash.com/featured/1200x800/?${randomTopic}&t=${timestamp}&r=${randomizer}`;
};

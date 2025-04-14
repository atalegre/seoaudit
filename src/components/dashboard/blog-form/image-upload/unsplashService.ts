
import { UnsplashImage, UnsplashSearchResponse } from './types';

export const searchUnsplashImages = async (query: string): Promise<UnsplashImage[]> => {
  try {
    // In a real implementation, you would call the Unsplash API here
    // For now, we'll return some dummy data
    console.log('Searching Unsplash for:', query);
    
    // Simulate API call
    const response: UnsplashSearchResponse = {
      results: [
        {
          id: 'photo1',
          urls: {
            raw: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
            full: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
            regular: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
            small: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
            thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
          },
          alt_description: 'Digital marketing concept',
          user: {
            name: 'John Doe',
            username: 'johndoe',
            links: {
              html: 'https://unsplash.com/@johndoe'
            }
          }
        },
        {
          id: 'photo2',
          urls: {
            raw: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
            full: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
            regular: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
            small: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
            thumb: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
          },
          alt_description: 'Technology concept',
          user: {
            name: 'Jane Smith',
            username: 'janesmith',
            links: {
              html: 'https://unsplash.com/@janesmith'
            }
          }
        }
      ],
      total: 2,
      total_pages: 1
    };
    
    return response.results;
  } catch (error) {
    console.error('Error searching Unsplash images:', error);
    return [];
  }
};

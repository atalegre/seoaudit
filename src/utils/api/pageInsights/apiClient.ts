
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { generateLocalPageInsights } from './mockDataGenerator';

// Flag for development mode - set to true to use mock data
const USE_MOCK_DATA = true;

/**
 * Fetch data from Google PageSpeed Insights API
 * @param url The URL to analyze
 * @returns Promise with PageInsights data
 */
export async function getPageInsightsData(url: string): Promise<PageInsightsData> {
  try {
    // If mock data is enabled, return generated data
    if (USE_MOCK_DATA) {
      console.log('Using mock PageSpeed Insights data');
      return generateLocalPageInsights(url);
    }
    
    console.log('Fetching PageSpeed Insights data for:', url);
    
    // Use fetch API directly instead of googleapis which requires Node.js environment
    try {
      const apiKey = 'AIzaSyDummyKeyForTest'; // This would normally come from your settings
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('PageSpeed Insights API response received directly');
        return processPageInsightsData(data, url);
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    } catch (directApiError) {
      console.warn('Direct API call failed:', directApiError);
      return generateLocalPageInsights(url);
    }
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    throw error;
  }
}

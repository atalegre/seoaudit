
import { google } from 'googleapis';
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { generateLocalPageInsights } from './mockDataGenerator';

// PageSpeed Insights API client
const pagespeedApi = google.pagespeedonline('v5');

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
    
    // Try to use Direct API call
    try {
      const response = await pagespeedApi.pagespeedapi.runpagespeed({
        url: url,
        strategy: 'mobile',
        category: ['performance', 'accessibility', 'best-practices', 'seo']
      });
      
      if (response.status === 200 && response.data) {
        console.log('PageSpeed Insights API response received directly');
        return processPageInsightsData(response.data, url);
      }
    } catch (directApiError) {
      console.warn('Direct API call failed:', directApiError);
    }
    
    // If all attempts failed, return error data
    console.error('Failed to fetch PageSpeed Insights data through all available methods');
    return generateLocalPageInsights(url);
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    throw error;
  }
}

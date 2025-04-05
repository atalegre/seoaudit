
import { google } from 'googleapis';
import type { PageInsightsData } from './types';
import { handleCorsRequest } from './corsHandlers';
import { generateMockData } from './mockDataGenerator';

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
      return generateMockData(url);
    }
    
    console.log('Fetching PageSpeed Insights data for:', url);
    
    // Try to use Direct API call first
    try {
      const response = await pagespeedApi.pagespeedapi.runpagespeed({
        url: url,
        strategy: 'mobile',
        category: ['performance', 'accessibility', 'best-practices', 'seo']
      });
      
      if (response.status === 200 && response.data) {
        console.log('PageSpeed Insights API response received directly');
        return processApiResponse(response.data, url);
      }
    } catch (directApiError) {
      console.warn('Direct API call failed, trying CORS proxy:', directApiError);
    }
    
    // If direct call failed, try CORS proxy
    const corsResponse = await handleCorsRequest(url);
    
    if (!corsResponse) {
      throw new Error('Failed to fetch PageSpeed Insights data through all available methods');
    }
    
    return processApiResponse(corsResponse, url);
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    throw error;
  }
}

/**
 * Process the raw API response into our app's data format
 */
function processApiResponse(data: any, url: string): PageInsightsData {
  // Processing logic here
  const result: PageInsightsData = {
    url: url,
    // Default values
    performance: { score: 0, metrics: {} },
    accessibility: { score: 0, metrics: {} },
    bestPractices: { score: 0, metrics: {} },
    seo: { score: 0, metrics: {} },
    mobile: { score: 0, metrics: {} },
    errors: []
  };
  
  try {
    // Extract the various scores from the API response
    if (data.lighthouseResult?.categories) {
      const categories = data.lighthouseResult.categories;
      
      if (categories.performance) {
        result.performance.score = Math.round(categories.performance.score * 100);
      }
      
      if (categories.accessibility) {
        result.accessibility.score = Math.round(categories.accessibility.score * 100);
      }
      
      if (categories['best-practices']) {
        result.bestPractices.score = Math.round(categories['best-practices'].score * 100);
      }
      
      if (categories.seo) {
        result.seo.score = Math.round(categories.seo.score * 100);
      }
    }
    
    // Extract other metrics as needed
    // (This is a simplified implementation)
    
    return result;
  } catch (error) {
    console.error('Error processing API response:', error);
    result.errors.push('Failed to process API response: ' + (error as Error).message);
    return result;
  }
}

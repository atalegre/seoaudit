
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { generateLocalPageInsights } from './mockDataGenerator';

// Flag for development mode - set to true to use mock data
const USE_MOCK_DATA = true;

/**
 * Fetch data from Google PageSpeed Insights API with performance optimizations
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
    
    // Implementa cache em memória para resultados recentes
    const cacheKey = `psi_${url.toLowerCase()}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const cacheTime = parsedData.timestamp;
        
        // Use cache if less than 30 minutes old
        if (Date.now() - cacheTime < 1000 * 60 * 30) {
          console.log('Using cached PSI data');
          return parsedData.data;
        }
      } catch (e) {
        console.warn('Error parsing cached data:', e);
      }
    }
    
    // Use fetch API with optimized settings
    try {
      const apiKey = 'AIzaSyDummyKeyForTest'; // This would normally come from your settings
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        },
        cache: 'force-cache' // Use HTTP cache when available
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('PageSpeed Insights API response received directly');
        
        const processedData = processPageInsightsData(data, url);
        
        // Cache the result
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data: processedData,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Error caching PSI data:', e);
        }
        
        return processedData;
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    } catch (directApiError) {
      console.warn('Direct API call failed:', directApiError);
      if (directApiError.name === 'AbortError') {
        console.warn('Request timeout exceeded');
      }
      return generateLocalPageInsights(url);
    }
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    throw error;
  }
}

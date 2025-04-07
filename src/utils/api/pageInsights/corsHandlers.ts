
import type { GooglePageInsightsResponse } from './types';

/**
 * Creates a timed request with timeout handling
 * @param url The URL to fetch
 * @param timeout Timeout in milliseconds
 * @returns Object with fetch props and clear timeout function
 */
export function createTimedRequest(url: string, timeout: number = 30000) {
  const controller = new AbortController();
  const signal = controller.signal;
  
  const timerId = setTimeout(() => controller.abort(), timeout);
  
  return {
    fetchProps: {
      signal,
      headers: {
        'Accept': 'application/json',
      },
    },
    clearTimeout: () => clearTimeout(timerId)
  };
}

/**
 * Alternative approach to handle CORS issues via a proxy
 * @param url The URL to analyze
 * @param strategy Device strategy - 'desktop' or 'mobile'
 * @returns Promise with API response
 */
export async function handleCorsRequest(url: string, strategy: 'desktop' | 'mobile' = 'mobile'): Promise<GooglePageInsightsResponse | null> {
  try {
    // This would normally be a proxy server that handles CORS
    // For demo purposes, we'll just simulate a response
    console.log('Using CORS proxy fallback for:', url);
    
    // In a real implementation, this would be replaced with an actual proxy call:
    // const proxyUrl = `https://your-cors-proxy.com/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;
    // const response = await fetch(proxyUrl);
    // return await response.json();
    
    // For this demo, we'll just return null to trigger the mock data
    return null;
  } catch (error) {
    console.error('CORS proxy failed:', error);
    return null;
  }
}

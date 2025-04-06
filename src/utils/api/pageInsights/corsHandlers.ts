
/**
 * Utility functions for handling CORS in page insights
 */
export function getDefaultHeaders() {
  return {
    'Accept': 'application/json',
    'Origin': window.location.origin
  };
}

/**
 * Creates a request with abort controller for timeouts
 * @param apiUrl The URL to fetch
 * @param timeout Timeout in milliseconds
 * @returns Object with fetch properties and clear timeout function
 */
export function createTimedRequest(apiUrl: string, timeout: number = 60000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return {
    fetchProps: { 
      signal: controller.signal,
      headers: getDefaultHeaders(),
      mode: 'cors' as RequestMode,
      cache: 'force-cache' as RequestCache
    },
    clearTimeout: () => clearTimeout(timeoutId)
  };
}

/**
 * Handle CORS requests for PageSpeed Insights
 * @param url The URL to analyze
 * @returns Promise with API response data
 */
export async function handleCorsRequest(url: string): Promise<any> {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl);
    
    const response = await fetch(apiUrl, fetchProps);
    clearTimeout();
    
    if (!response.ok) {
      throw new Error(`CORS proxy request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in handleCorsRequest:', error);
    return null;
  }
}

/**
 * Gets CORS headers for Google Search Console API
 */
export function getGoogleApiHeaders(authToken: string) {
  return {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': window.location.origin
  };
}

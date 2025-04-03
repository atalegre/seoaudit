
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
      cache: 'no-cache' as RequestCache
    },
    clearTimeout: () => clearTimeout(timeoutId)
  };
}

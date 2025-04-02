
/**
 * Utility functions for handling CORS in page insights
 */
export function getDefaultHeaders() {
  return {
    'Accept': 'application/json'
  };
}

/**
 * Creates a request with abort controller for timeouts
 * @param apiUrl The URL to fetch
 * @param timeout Timeout in milliseconds
 * @returns Object with fetch properties and clear timeout function
 */
export function createTimedRequest(apiUrl: string, timeout: number = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return {
    fetchProps: { 
      signal: controller.signal,
      headers: getDefaultHeaders()
    },
    clearTimeout: () => clearTimeout(timeoutId)
  };
}

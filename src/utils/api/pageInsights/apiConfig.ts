
/**
 * Configuration and utility functions for the PageSpeed Insights API
 */

// Default cache expiration time (30 minutes)
export const CACHE_TTL = 1000 * 60 * 30;

// Option to use mock data as fallback when the API fails
export const USE_MOCK_DATA_ON_FAILURE = false;

/**
 * Gets the API key information for the frontend
 * @returns Information about the API key configuration
 */
export function getApiKey(): string {
  return 'API Key secured on server';
}

/**
 * Normalizes a URL for consistency in caching
 * @param url URL to normalize
 * @returns Normalized URL
 */
export function normalizeUrl(url: string): string {
  // Garantir que a URL tenha https:// no início
  let normalizedUrl = url.toLowerCase().trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  
  // Remover barras finais para consistência
  normalizedUrl = normalizedUrl.replace(/\/+$/, '');
  
  return normalizedUrl;
}

/**
 * Creates a cache key for storing PageSpeed results
 * @param url URL being analyzed
 * @param strategy Device strategy
 * @returns Cache key string
 */
export function createCacheKey(url: string, strategy: 'desktop' | 'mobile'): string {
  const normalizedUrl = normalizeUrl(url);
  return `psi_${normalizedUrl}_${strategy}`;
}

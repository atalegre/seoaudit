/**
 * Configuration and utility functions for the PageSpeed Insights API
 */

// Expose a public API key constant
export const PUBLIC_API_KEY = 'AIzaSyD_9C6lkjO6gMgXqMD8VHjqTDqKwEcpPmU'; // Default public PageSpeed API key

// Set to false to disable mock data usage on API failures
export const USE_MOCK_DATA_ON_FAILURE = false;

// Default cache expiration time (30 minutes)
export const CACHE_TTL = 1000 * 60 * 30;

/**
 * Gets the API key from environment or uses a public default key
 * @returns The PageSpeed API key
 */
export function getApiKey(): string {
  // API Key is now stored and used only on the server
  console.log('🔒 A chave API agora está protegida no servidor');
  return PUBLIC_API_KEY;
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


/**
 * Configuration and utility functions for the PageSpeed Insights API
 */

// Set to false to disable mock data usage on API failures
export const USE_MOCK_DATA_ON_FAILURE = false;

// Default cache expiration time (30 minutes)
export const CACHE_TTL = 1000 * 60 * 30;

/**
 * Gets the API key from environment or uses a temporary default key
 * @returns The PageSpeed API key
 */
export function getApiKey(): string {
  // Tentar obter do ambiente Vite primeiro
  const envApiKey = import.meta.env.VITE_PAGESPEED_API_KEY;
  
  // Se não encontrar no ambiente Vite, tentar usar um valor definido diretamente
  const hardcodedKey = 'AIzaSyA-nwrPN2F1lLrouVS2ll8W4R0dDm7Cbd8';
  
  if (!envApiKey && !hardcodedKey) {
    console.warn('⚠️ VITE_PAGESPEED_API_KEY não está definida no ambiente. Configure-a para uso em produção!');
  }
  
  // Log para verificar qual chave está sendo usada
  const keyToUse = envApiKey || hardcodedKey || '';
  console.log(`🔑 Usando chave API (primeiros 4 caracteres): ${keyToUse.substring(0, 4)}...`);
  
  return keyToUse;
}

/**
 * Creates the API URL for PageSpeed Insights
 * @param url The URL to analyze
 * @param apiKey API key for Google PageSpeed
 * @param strategy Device strategy (mobile or desktop)
 * @returns Formatted API URL
 */
export function createApiUrl(url: string, apiKey: string, strategy: 'desktop' | 'mobile'): string {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
  console.log(`🔗 URL da API construída (sem a chave): ${apiUrl.replace(apiKey, 'CHAVE-OCULTA')}`);
  return apiUrl;
}

/**
 * Normalizes a URL for consistency in caching
 * @param url URL to normalize
 * @returns Normalized URL
 */
export function normalizeUrl(url: string): string {
  return url.toLowerCase().trim();
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

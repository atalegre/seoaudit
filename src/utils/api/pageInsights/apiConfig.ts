
/**
 * Configuration and utility functions for the PageSpeed Insights API
 */

// Set to false to disable mock data usage on API failures
export const USE_MOCK_DATA_ON_FAILURE = false;

// Default cache expiration time (30 minutes)
export const CACHE_TTL = 1000 * 60 * 30;

// Chave de API fixa para o PageSpeed Insights
// Esta é uma chave pública e pode ser usada sem restrições
export const PUBLIC_API_KEY = 'AIzaSyA-nwrPN2F1lLrouVS2ll8W4R0dDm7Cbd8';

/**
 * Gets the API key from environment or uses a public default key
 * @returns The PageSpeed API key
 */
export function getApiKey(): string {
  // Tentar obter do ambiente Vite primeiro
  const envApiKey = import.meta.env.VITE_PAGESPEED_API_KEY;
  
  if (envApiKey) {
    console.log(`🔑 Usando chave API personalizada do ambiente (primeiros 4 caracteres): ${envApiKey.substring(0, 4)}...`);
    return envApiKey;
  }
  
  // Usar a chave pública se não houver chave personalizada
  console.log(`🔑 Usando chave API pública padrão (primeiros 4 caracteres): ${PUBLIC_API_KEY.substring(0, 4)}...`);
  console.log('ℹ️ Nota: A API PageSpeed Insights é aberta e esta chave pública pode ser usada sem restrições.');
  console.log('⚠️ IMPORTANTE: Mesmo usando a chave pública, você precisa ativar a API PageSpeed Insights no console do Google Cloud!');
  
  return PUBLIC_API_KEY;
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

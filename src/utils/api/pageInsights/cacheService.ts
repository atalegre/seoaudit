
import { CACHE_TTL } from './apiConfig';
import type { PageInsightsData } from './types';

/**
 * In-memory cache for PageSpeed results
 */
const memoryCache = new Map<string, {data: PageInsightsData, timestamp: number}>();

/**
 * Gets data from memory cache if available and not expired
 * @param cacheKey Cache key to lookup
 * @returns Cached data or null if not found/expired
 */
export function getFromMemoryCache(cacheKey: string): PageInsightsData | null {
  const cachedResult = memoryCache.get(cacheKey);
  if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_TTL)) {
    console.log('✅ Usando dados em cache da memória');
    return cachedResult.data;
  }
  return null;
}

/**
 * Stores data in memory cache
 * @param cacheKey Cache key to store under
 * @param data PageInsights data to cache
 */
export function storeInMemoryCache(cacheKey: string, data: PageInsightsData): void {
  memoryCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Gets data from sessionStorage if available and not expired
 * @param cacheKey Cache key to lookup
 * @returns Cached data or null if not found/expired
 */
export function getFromSessionStorage(cacheKey: string): PageInsightsData | null {
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      const cacheTime = parsedData.timestamp;
      
      // Use cache if less than TTL old
      if (Date.now() - cacheTime < CACHE_TTL) {
        console.log('✅ Usando dados em cache do sessionStorage');
        const result = parsedData.data;
        
        // Update memory cache as well
        storeInMemoryCache(cacheKey, result);
        
        return result;
      }
    } catch (e) {
      console.warn('⚠️ Erro ao processar dados em cache:', e);
    }
  }
  return null;
}

/**
 * Stores data in sessionStorage
 * @param cacheKey Cache key to store under
 * @param data PageInsights data to cache
 */
export function storeInSessionStorage(cacheKey: string, data: PageInsightsData): void {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('⚠️ Erro ao armazenar dados em sessionStorage:', e);
  }
}

/**
 * Clears all PageSpeed caches starting with the given prefix
 * @param prefix Cache key prefix to clear (default: 'psi_')
 */
export function clearCache(prefix: string = 'psi_'): void {
  // Clear memory cache
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
  
  // Clear sessionStorage cache
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(prefix)) {
      sessionStorage.removeItem(key);
    }
  }
  
  console.log('🧹 Cache PageSpeed limpo');
}

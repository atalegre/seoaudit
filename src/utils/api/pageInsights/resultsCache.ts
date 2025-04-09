
/**
 * Cache management for processed PageSpeed Insights results
 */
import { PageInsightsData } from './types';

// Cache time-to-live (24 hours)
const CACHE_TTL = 1000 * 60 * 60 * 24; 

// In-memory cache for results to avoid reprocessing
const resultsCache = new Map<string, {data: PageInsightsData, timestamp: number}>();

/**
 * Check if cached result exists and is valid
 * @param cacheKey Cache key to check
 * @returns Cached data or null if not found/expired
 */
export function getFromResultsCache(cacheKey: string): PageInsightsData | null {
  const cached = resultsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

/**
 * Store processed result in cache
 * @param cacheKey Cache key to store under
 * @param data Processed PageInsights data
 */
export function storeInResultsCache(cacheKey: string, data: PageInsightsData): void {
  resultsCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Create a cache key for processed results
 * @param url URL that was analyzed
 * @returns Formatted cache key
 */
export function createResultsCacheKey(url: string): string {
  return `${url.toLowerCase().trim()}_v2`;
}


/**
 * Process raw data from Google PageSpeed Insights API
 */
import { GooglePageInsightsResponse, PageInsightsData } from './types';
import { extractCoreMetrics, extractPageAttributes } from './metricsExtractor';
import { processRecommendations } from './recommendationProcessor';
import { createResultsCacheKey, getFromResultsCache, storeInResultsCache } from './resultsCache';

/**
 * Process raw data from Google Page Insights API
 * @param data Google API response data
 * @param url The URL being analyzed
 * @returns Processed page insights data
 */
export function processPageInsightsData(data: GooglePageInsightsResponse, url: string): PageInsightsData {
  // Check cache first
  const cacheKey = createResultsCacheKey(url);
  const cached = getFromResultsCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Get core metrics
    const coreMetrics = extractCoreMetrics(data);
    
    // Get page attributes
    const pageAttributes = extractPageAttributes(data);
    
    // Process recommendations
    const lighthouse = data?.lighthouseResult || {};
    const audits = lighthouse.audits || {};
    const recommendations = processRecommendations(audits);
    
    // Combine all data
    const result: PageInsightsData = {
      ...coreMetrics as any,
      ...pageAttributes as any,
      recommendations
    };
    
    // Save in cache
    storeInResultsCache(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error processing PageInsights data:', error);
    throw new Error('Falha ao processar dados da API PageInsights');
  }
}

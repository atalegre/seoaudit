
import { toast } from 'sonner';
import { createTimedRequest, getGoogleApiHeaders } from '../pageInsights/corsHandlers';
import { SEARCH_CONSOLE_API, normalizeUrl, getDateRange } from './config';
import type { SearchConsoleError, IndexationResult } from './types';

/**
 * Checks if specific URLs are indexed in Google
 * @param siteUrl URL of the site
 * @param authToken Google authentication token
 * @param pagePaths Array of page paths to check (without the domain)
 */
export async function checkIndexedUrls(
  siteUrl: string,
  authToken: string,
  pagePaths: string[] = []
): Promise<IndexationResult> {
  try {
    console.log('Verificando indexação de URLs para:', siteUrl);
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(siteUrl);
    
    const apiUrl = `${SEARCH_CONSOLE_API}/${encodeURIComponent(normalizedUrl)}/urlInspection/index`;
    const results: IndexationResult = {};
    
    // Process each URL individually to check indexation
    for (const path of pagePaths) {
      const fullUrl = new URL(path, normalizedUrl).toString();
      const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 30000);
      
      try {
        const response = await fetch(apiUrl, {
          ...fetchProps,
          method: 'POST',
          headers: getGoogleApiHeaders(authToken),
          body: JSON.stringify({
            inspectionUrl: fullUrl,
            siteUrl: normalizedUrl
          })
        });
        
        clearTimeout();
        
        if (!response.ok) {
          console.error(`Erro ao verificar indexação para ${fullUrl}:`, response.statusText);
          results[path] = false;
          continue;
        }
        
        const data = await response.json();
        // Check if URL is indexed based on the response
        results[path] = data.inspectionResult?.indexStatusResult?.verdict === 'PASS';
      } catch (error) {
        console.error(`Erro ao verificar indexação para ${fullUrl}:`, error);
        results[path] = false;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Erro ao verificar indexação de URLs:', error);
    toast.error('Erro ao verificar indexação de URLs', {
      description: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return {};
  }
}

/**
 * Gets a list of all indexed URLs for a site
 * @param siteUrl URL of the site
 * @param authToken Google authentication token
 * @param startDate Optional start date (YYYY-MM-DD)
 * @param endDate Optional end date (YYYY-MM-DD)
 */
export async function getAllIndexedUrls(
  siteUrl: string,
  authToken: string,
  startDate?: string,
  endDate?: string
): Promise<string[]> {
  try {
    console.log('Obtendo todas as URLs indexadas para:', siteUrl);
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(siteUrl);
    
    // Get date range
    const dates = getDateRange(startDate, endDate);
    
    // Use the analytics API to get URLs
    const apiUrl = `${SEARCH_CONSOLE_API}/${encodeURIComponent(normalizedUrl)}/searchAnalytics/query`;
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 30000);
    
    const response = await fetch(apiUrl, {
      ...fetchProps,
      method: 'POST',
      headers: getGoogleApiHeaders(authToken),
      body: JSON.stringify({
        startDate: dates.startDate,
        endDate: dates.endDate,
        dimensions: ['page'],
        rowLimit: 1000 // Request maximum number of results
      })
    });
    
    clearTimeout();
    
    if (!response.ok) {
      const errorData = await response.json() as SearchConsoleError;
      console.error('Erro ao obter URLs indexadas:', errorData);
      toast.error('Erro ao obter URLs indexadas', {
        description: errorData.error?.message || 'Falha na requisição',
      });
      return [];
    }
    
    const data = await response.json();
    
    // Extract URLs from the response
    const indexedUrls = data.rows?.map((row: any) => row.keys[0]) || [];
    return indexedUrls;
  } catch (error) {
    console.error('Erro ao obter URLs indexadas:', error);
    toast.error('Erro ao obter URLs indexadas', {
      description: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return [];
  }
}

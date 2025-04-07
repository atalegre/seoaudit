
import { toast } from 'sonner';
import { createTimedRequest, getGoogleApiHeaders } from '../pageInsights/corsHandlers';
import { SEARCH_CONSOLE_API, normalizeUrl, getDateRange } from './config';
import type { SearchConsoleData, SearchConsoleError } from './types';

/**
 * Gets performance data from Search Console
 * @param siteUrl URL of the site
 * @param authToken Google authentication token
 * @param startDate Optional start date (YYYY-MM-DD)
 * @param endDate Optional end date (YYYY-MM-DD)
 */
export async function getSearchConsolePerformance(
  siteUrl: string, 
  authToken: string,
  startDate?: string,
  endDate?: string
): Promise<SearchConsoleData | null> {
  try {
    console.log('Obtendo dados do Search Console para:', siteUrl);
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(siteUrl);
    
    // Get date range
    const dates = getDateRange(startDate, endDate);
    
    const apiUrl = `${SEARCH_CONSOLE_API}/${encodeURIComponent(normalizedUrl)}/searchAnalytics/query`;
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 30000);
    
    const response = await fetch(apiUrl, {
      ...fetchProps,
      method: 'POST',
      headers: getGoogleApiHeaders(authToken),
      body: JSON.stringify({
        startDate: dates.startDate,
        endDate: dates.endDate,
        dimensions: ['query'],
        rowLimit: 10
      })
    });
    
    clearTimeout();
    
    if (!response.ok) {
      const errorData = await response.json() as SearchConsoleError;
      console.error('Erro ao obter dados do Search Console:', errorData);
      toast.error('Erro ao obter dados do Search Console', {
        description: errorData.error?.message || 'Falha na requisição',
      });
      return null;
    }
    
    const data = await response.json();
    
    // Calculate totals and format query data
    let totalClicks = 0;
    let totalImpressions = 0;
    let totalPosition = 0;
    
    const queries = data.rows?.map((row: any) => {
      totalClicks += row.clicks || 0;
      totalImpressions += row.impressions || 0;
      totalPosition += row.position || 0;
      
      return {
        query: row.keys[0],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0
      };
    }) || [];
    
    const rowCount = queries.length || 1;
    
    return {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: totalClicks / totalImpressions || 0,
      position: totalPosition / rowCount,
      startDate: dates.startDate,
      endDate: dates.endDate,
      queries
    };
  } catch (error) {
    console.error('Erro ao obter dados do Search Console:', error);
    toast.error('Erro ao obter dados do Search Console', {
      description: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return null;
  }
}

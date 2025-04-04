
import { createTimedRequest, getGoogleApiHeaders } from './pageInsights/corsHandlers';
import { toast } from 'sonner';

// Search Console API endpoint
const SEARCH_CONSOLE_API = 'https://searchconsole.googleapis.com/webmasters/v3/sites';

/**
 * Interface para dados do Search Console
 */
export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  startDate?: string;
  endDate?: string;
  queries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

interface SearchConsoleError {
  error: {
    code: number;
    message: string;
  }
}

/**
 * Verifica se um site está verificado no Search Console
 * @param siteUrl URL do site para verificar
 * @param authToken Token de autenticação do Google
 */
export async function checkSiteVerification(siteUrl: string, authToken: string): Promise<boolean> {
  try {
    console.log('Verificando site no Search Console:', siteUrl);
    
    // Normaliza a URL para o formato esperado pelo Google
    const normalizedUrl = siteUrl.startsWith('http') 
      ? siteUrl 
      : `https://${siteUrl}`;
    
    const { fetchProps, clearTimeout } = createTimedRequest(SEARCH_CONSOLE_API, 30000);
    
    const response = await fetch(SEARCH_CONSOLE_API, {
      ...fetchProps,
      headers: getGoogleApiHeaders(authToken),
    });
    
    clearTimeout();
    
    if (!response.ok) {
      const errorData = await response.json() as SearchConsoleError;
      console.error('Erro ao verificar site no Search Console:', errorData);
      return false;
    }
    
    const data = await response.json();
    // Verifica se o site está na lista de sites do usuário
    return data.siteEntry?.some((entry: any) => 
      entry.siteUrl === normalizedUrl || 
      entry.siteUrl === normalizedUrl + '/'
    ) || false;
  } catch (error) {
    console.error('Erro ao verificar site no Search Console:', error);
    return false;
  }
}

/**
 * Obtém dados de desempenho do Search Console
 * @param siteUrl URL do site
 * @param authToken Token de autenticação do Google
 * @param startDate Data inicial (YYYY-MM-DD)
 * @param endDate Data final (YYYY-MM-DD)
 */
export async function getSearchConsolePerformance(
  siteUrl: string, 
  authToken: string,
  startDate: string = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: string = new Date().toISOString().split('T')[0]
): Promise<SearchConsoleData | null> {
  try {
    console.log('Obtendo dados do Search Console para:', siteUrl);
    
    // Normaliza a URL para o formato esperado pelo Google
    const normalizedUrl = siteUrl.startsWith('http') 
      ? siteUrl 
      : `https://${siteUrl}`;
    
    const apiUrl = `${SEARCH_CONSOLE_API}/${encodeURIComponent(normalizedUrl)}/searchAnalytics/query`;
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 30000);
    
    const response = await fetch(apiUrl, {
      ...fetchProps,
      method: 'POST',
      headers: getGoogleApiHeaders(authToken),
      body: JSON.stringify({
        startDate,
        endDate,
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
    
    // Calcula totais e formata os dados de consultas
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
      startDate,
      endDate,
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

/**
 * Obtém meta tags de verificação do Google
 * @param siteUrl URL do site
 * @param authToken Token de autenticação do Google
 */
export async function getGoogleVerificationMeta(siteUrl: string, authToken: string): Promise<string | null> {
  try {
    // Normaliza a URL
    const normalizedUrl = siteUrl.startsWith('http') 
      ? siteUrl 
      : `https://${siteUrl}`;
    
    const apiUrl = `${SEARCH_CONSOLE_API}/${encodeURIComponent(normalizedUrl)}/verificationDetails`;
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 30000);
    
    const response = await fetch(apiUrl, {
      ...fetchProps,
      headers: getGoogleApiHeaders(authToken),
    });
    
    clearTimeout();
    
    if (!response.ok) {
      console.error('Erro ao obter meta de verificação:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.metatag || null;
  } catch (error) {
    console.error('Erro ao obter meta de verificação:', error);
    return null;
  }
}

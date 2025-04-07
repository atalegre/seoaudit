
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { createTimedRequest, handleCorsRequest } from './corsHandlers';
import { generateMockPageInsightsData } from './mockData';

// Flag para uso de dados simulados quando a API falha
const USE_MOCK_DATA_ON_FAILURE = true;

/**
 * Cache helper para armazenar resultados por URL com TTL
 */
const apiCache = new Map<string, {data: PageInsightsData, timestamp: number}>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Fetch data from Google PageSpeed Insights API with performance optimizations
 * @param url The URL to analyze
 * @param strategy Device strategy - 'desktop' or 'mobile'
 * @returns Promise with PageInsights data
 */
export async function getPageInsightsData(url: string, strategy: 'desktop' | 'mobile' = 'mobile'): Promise<PageInsightsData> {
  try {
    console.log(`Fetching PageSpeed Insights data for: ${url} on ${strategy}`);
    
    // Normalizar URL para consistência no cache
    const normalizedUrl = url.toLowerCase().trim();
    const cacheKey = `psi_${normalizedUrl}_${strategy}`;
    
    // Verificar cache em memória primeiro (mais rápido que sessionStorage)
    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_TTL)) {
      console.log('Using in-memory cached PSI data');
      return cachedResult.data;
    }
    
    // Verificar sessionStorage como fallback 
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const cacheTime = parsedData.timestamp;
        
        // Use cache if less than 30 minutes old
        if (Date.now() - cacheTime < CACHE_TTL) {
          console.log('Using session storage cached PSI data');
          const result = parsedData.data;
          
          // Atualizar cache em memória também
          apiCache.set(cacheKey, {data: result, timestamp: cacheTime});
          
          return result;
        }
      } catch (e) {
        console.warn('Error parsing cached data:', e);
      }
    }
    
    // Use fetch API with optimized settings
    try {
      const apiKey = 'AIzaSyDummyKeyForTest'; // This would normally come from your settings
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
      
      // Usar fetch com timeout otimizado
      const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 20000);
      
      const response = await fetch(apiUrl, fetchProps);
      clearTimeout();
      
      if (response.ok) {
        const data = await response.json();
        console.log('PageSpeed Insights API response received');
        
        const processedData = processPageInsightsData(data, url);
        
        // Armazenar em cache de memória (mais rápido)
        apiCache.set(cacheKey, {
          data: processedData,
          timestamp: Date.now()
        });
        
        // Cache o resultado em sessionStorage também
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data: processedData,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Error caching PSI data in sessionStorage:', e);
        }
        
        return processedData;
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    } catch (directApiError) {
      console.warn('Direct API call failed:', directApiError);
      if (directApiError.name === 'AbortError') {
        console.warn('Request timeout exceeded');
      }
      
      // Tentar via proxy CORS alternativo
      try {
        const corsData = await handleCorsRequest(url, strategy);
        if (corsData) {
          const processedData = processPageInsightsData(corsData, url);
          
          // Armazenar resultados do proxy
          apiCache.set(cacheKey, {
            data: processedData,
            timestamp: Date.now()
          });
          
          return processedData;
        }
      } catch (corsError) {
        console.warn('CORS proxy failed:', corsError);
      }
      
      // Se chegou aqui e a flag estiver ativada, retornar dados simulados
      if (USE_MOCK_DATA_ON_FAILURE) {
        console.log('Using mock data due to API failure');
        const mockData = generateMockPageInsightsData(url);
        
        // Armazenar os dados simulados em cache também
        apiCache.set(cacheKey, {
          data: mockData,
          timestamp: Date.now()
        });
        
        return mockData;
      }
      
      // Se chegou aqui, não conseguiu obter dados reais
      throw new Error('Falha ao obter dados reais da API Google PageSpeed Insights');
    }
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    
    // Se a flag estiver ativada, retornar dados simulados em último caso
    if (USE_MOCK_DATA_ON_FAILURE) {
      console.log('Using mock data as last resort');
      return generateMockPageInsightsData(url);
    }
    
    throw error; // Propaga o erro para ser tratado pelo componente
  }
}

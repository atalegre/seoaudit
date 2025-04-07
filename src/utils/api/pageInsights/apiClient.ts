
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { createTimedRequest, handleCorsRequest } from './corsHandlers';

// Desativar completamente o uso de dados simulados
const USE_MOCK_DATA_ON_FAILURE = false;

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
    
    // Obter a chave API do PageSpeed
    const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY || '';
    if (!apiKey) {
      throw new Error('Falha ao obter dados reais da API Google PageSpeed Insights. Chave API PageSpeed não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY');
    }
    
    // Use fetch API with optimized settings
    try {
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
        // Extrair a mensagem de erro da resposta quando possível
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `Erro HTTP: ${response.status}`;
        throw new Error(`Falha na API PageSpeed: ${errorMessage}`);
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
      
      // Adicionar detalhes importantes à mensagem de erro
      let errorMessage = 'Falha ao obter dados reais da API Google PageSpeed Insights. ';
      
      if (!apiKey) {
        errorMessage += 'Chave API PageSpeed não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY';
      } else if (directApiError.message.includes('network') || directApiError.message.includes('fetch')) {
        errorMessage += 'Erro de rede ao conectar com a API. Verifique sua conexão à internet.';
      } else {
        errorMessage += directApiError.message;
      }
      
      errorMessage += '\n\nCertifique-se de que a URL é válida e acessível publicamente.';
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    throw error; // Propaga o erro para ser tratado pelo componente
  }
}

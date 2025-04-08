
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { createTimedRequest, handleCorsRequest } from './corsHandlers';

// Desativar completamente o uso de dados simulados
const USE_MOCK_DATA_ON_FAILURE = false;

// Atualizar com a chave fornecida pelo usuário
const TEMP_API_KEY = 'AIzaSyCFVgBqjPaV1-aOx4vFGkwwGQF_2Iwaqw4';

// Export a function to get the API key for use in other components
export function getApiKey() {
  return import.meta.env.VITE_PAGESPEED_API_KEY || TEMP_API_KEY;
}

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
    
    // Obter a chave API do PageSpeed - usar a chave temporária se a env não estiver disponível
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Falha ao obter dados reais da API Google PageSpeed Insights. Chave API PageSpeed não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY');
    }
    
    console.log('Usando chave API PageSpeed:', apiKey.substring(0, 8) + '...');
    
    // Verificar se a API está ativada - fazer uma requisição preliminar
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    // Usar fetch com timeout reduzido - 25 segundos para evitar AbortError com signal
    const timeoutMs = 25000;
    
    try {
      console.log(`Iniciando requisição com timeout de ${timeoutMs}ms`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Timeout excedido, abortando requisição');
        controller.abort();
      }, timeoutMs);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      // Limpar o timeout pois a resposta foi recebida
      clearTimeout(timeoutId);
      
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
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
            
            // Check for specific API not enabled error
            if (errorMessage.includes('API has not been used') || 
                errorMessage.includes('API has not been enabled')) {
              throw new Error(`A API PageSpeed Insights não está ativada. Acesse o console do Google Cloud e ative-a para o projeto associado à sua chave API. Erro original: ${errorMessage}`);
            }
          }
        } catch (e) {
          console.warn('Failed to parse error response:', e);
        }
        
        throw new Error(`Falha na API PageSpeed: ${errorMessage}`);
      }
    } catch (apiError: any) {
      console.warn('Direct API call failed:', apiError);
      
      if (apiError.name === 'AbortError') {
        console.warn('Request timeout exceeded');
        throw new Error('Timeout excedido ao conectar com a API PageSpeed Insights. Tente novamente mais tarde.');
      }
      
      if (apiError.message.includes('API has not been used') || 
          apiError.message.includes('API has not been enabled')) {
        // API not enabled error
        throw apiError;
      }
      
      // Tentar via proxy CORS alternativo
      try {
        console.log('Using CORS proxy fallback for:', url);
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
      } else if (apiError.message.includes('network') || apiError.message.includes('fetch')) {
        errorMessage += 'Erro de rede ao conectar com a API. Verifique sua conexão à internet.';
      } else {
        errorMessage += apiError.message;
      }
      
      errorMessage += '\n\nCertifique-se de que a URL é válida e acessível publicamente.';
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error in getPageInsightsData:', error);
    throw error; // Propaga o erro para ser tratado pelo componente
  }
}

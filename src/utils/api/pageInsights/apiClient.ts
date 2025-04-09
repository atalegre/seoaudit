
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { createTimedRequest, handleCorsRequest } from './corsHandlers';

// Desativar completamente o uso de dados simulados
const USE_MOCK_DATA_ON_FAILURE = false;

/**
 * Obtém a chave de API do ambiente ou usa uma chave padrão temporária
 * @returns A chave da API PageSpeed
 */
export function getApiKey(): string {
  const envApiKey = import.meta.env.VITE_PAGESPEED_API_KEY;
  
  if (!envApiKey) {
    console.warn('⚠️ VITE_PAGESPEED_API_KEY não está definida no ambiente. Configure-a para uso em produção!');
  }
  
  return envApiKey || '';
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
    console.log(`🔍 Iniciando análise PageSpeed para: ${url} (${strategy})`);
    
    // Normalizar URL para consistência no cache
    const normalizedUrl = url.toLowerCase().trim();
    const cacheKey = `psi_${normalizedUrl}_${strategy}`;
    
    // Verificar cache em memória primeiro (mais rápido que sessionStorage)
    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_TTL)) {
      console.log('✅ Usando dados em cache da memória');
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
          console.log('✅ Usando dados em cache do sessionStorage');
          const result = parsedData.data;
          
          // Atualizar cache em memória também
          apiCache.set(cacheKey, {data: result, timestamp: cacheTime});
          
          return result;
        }
      } catch (e) {
        console.warn('⚠️ Erro ao processar dados em cache:', e);
      }
    }
    
    // Obter a chave API do PageSpeed
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('❌ API Key não configurada. Defina a variável de ambiente VITE_PAGESPEED_API_KEY com sua chave da Google API.');
    }
    
    console.log('🔑 Usando chave API PageSpeed:', apiKey.substring(0, 4) + '...');
    
    // Construir URL da API
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    // Reduzir o timeout para 18 segundos para evitar o timeout do navegador
    const timeoutMs = 18000;
    
    console.log(`⏱️ Iniciando requisição com timeout de ${timeoutMs}ms`);
    
    try {
      // Usar uma abordagem diferente para evitar problemas de AbortController
      const fetchPromise = fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Criar um timeout manual
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeoutMs);
      });
      
      // Race entre o fetch e o timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      if (!response.ok) {
        // Extrair detalhes do erro da resposta
        let errorData;
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        
        try {
          errorData = await response.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          console.error('❌ Não foi possível processar resposta de erro:', e);
        }
        
        console.error(`❌ Erro na API PageSpeed: ${errorMessage}`);
        
        // Verificar erros específicos de API não ativada
        if (errorMessage.includes('API has not been used') || 
            errorMessage.includes('API has not been enabled')) {
          throw new Error(`❌ A API PageSpeed Insights não está ativada. Acesse o console do Google Cloud e ative-a para o projeto associado à sua chave API. Erro original: ${errorMessage}`);
        }
        
        throw new Error(`❌ Falha na API PageSpeed: ${errorMessage}`);
      }
      
      // Processar resposta bem-sucedida
      const data = await response.json();
      console.log(`✅ Resposta da API PageSpeed recebida para ${strategy}`);
      
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
        console.warn('⚠️ Erro ao armazenar dados em sessionStorage:', e);
      }
      
      return processedData;
    } catch (apiError: any) {
      console.error(`❌ Falha na chamada à API para ${strategy}:`, apiError.message);
      
      if (apiError.message === 'Timeout') {
        console.warn(`⏱️ Timeout excedido para ${strategy}`);
        
        // Tentar alternativa com CORS Proxy para timeouts
        try {
          console.log(`🔄 Tentando via proxy CORS para ${strategy}`);
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
          console.warn(`❌ Falha no proxy CORS para ${strategy}:`, corsError);
        }
        
        throw new Error(`⏱️ Timeout excedido ao conectar com a API PageSpeed Insights para ${strategy}. Tente novamente mais tarde.`);
      }
      
      // Manter detecção de erros específicos
      if (apiError.message.includes('API has not been used') || 
          apiError.message.includes('API has not been enabled')) {
        // API not enabled error
        throw apiError;
      }
      
      // Tentar via proxy CORS alternativo
      try {
        console.log(`🔄 Tentando via proxy CORS para ${strategy}`);
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
        console.warn(`❌ Falha no proxy CORS para ${strategy}:`, corsError);
      }
      
      // Adicionar detalhes importantes à mensagem de erro
      let errorMessage = `❌ Falha ao obter dados da API Google PageSpeed Insights para ${strategy}. `;
      
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
    console.error(`❌ Erro crítico em getPageInsightsData para ${strategy}:`, error);
    throw error; // Propaga o erro para ser tratado pelo componente
  }
}

import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { handleCorsRequest } from './corsHandlers';
import { getApiKey, createApiUrl, createCacheKey } from './apiConfig';
import { getFromMemoryCache, getFromSessionStorage, storeInMemoryCache, storeInSessionStorage } from './cacheService';
import { createDetailedErrorMessage, extractHttpErrorDetails, isApiNotEnabledError } from './errorHandler';

/**
 * Fetch data from Google PageSpeed Insights API with performance optimizations
 * @param url The URL to analyze
 * @param strategy Device strategy - 'desktop' or 'mobile'
 * @returns Promise with PageInsights data
 */
export async function getPageInsightsData(url: string, strategy: 'desktop' | 'mobile' = 'mobile'): Promise<PageInsightsData> {
  try {
    console.log(`🔍 Iniciando análise PageSpeed para: ${url} (${strategy})`);
    
    // Create cache key
    const cacheKey = createCacheKey(url, strategy);
    
    // Check memory cache first (faster than sessionStorage)
    const memoryResult = getFromMemoryCache(cacheKey);
    if (memoryResult) {
      console.log(`⚡ Usando dados em cache da memória para ${strategy}`);
      return memoryResult;
    }
    
    // Check sessionStorage as fallback
    const sessionResult = getFromSessionStorage(cacheKey);
    if (sessionResult) {
      console.log(`📦 Usando dados em cache do sessionStorage para ${strategy}`);
      return sessionResult;
    }
    
    // Get the PageSpeed API key
    const apiKey = getApiKey();
    
    // Log a chave API para depuração (apenas os primeiros e últimos 4 caracteres por segurança)
    if (apiKey) {
      const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
      console.log(`🔑 Usando chave API PageSpeed: ${maskedKey}`);
    } else {
      console.error('❌ API Key não configurada. Defina a variável de ambiente VITE_PAGESPEED_API_KEY com sua chave da Google API.');
      throw new Error('❌ API Key não configurada. Defina a variável de ambiente VITE_PAGESPEED_API_KEY com sua chave da Google API.');
    }
    
    // Build API URL
    const apiUrl = createApiUrl(url, apiKey, strategy);
    console.log(`🔗 URL da API construída (sem a chave): ${apiUrl.replace(apiKey, 'CHAVE-OCULTA')}`);
    
    // Set timeout to 18 seconds to avoid browser timeout
    const timeoutMs = 18000;
    
    console.log(`⏱️ Iniciando requisição com timeout de ${timeoutMs}ms para ${strategy}`);
    
    try {
      // Create a manual timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeoutMs);
      });
      
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(apiUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        }),
        timeoutPromise
      ]) as Response;
      
      if (!response.ok) {
        // Log completo da resposta para depuração
        console.error(`❌ Erro na API PageSpeed (${strategy}):`, response.status, response.statusText);
        
        // Extract error details from response
        const errorMessage = await extractHttpErrorDetails(response);
        console.error(`❌ Detalhes do erro: ${errorMessage}`);
        
        // Check for specific API not enabled errors
        if (isApiNotEnabledError(errorMessage)) {
          console.error(`❌ A API PageSpeed Insights não está ativada!`);
          throw new Error(`❌ A API PageSpeed Insights não está ativada. Acesse o console do Google Cloud e ative-a para o projeto associado à sua chave API. Erro original: ${errorMessage}`);
        }
        
        throw new Error(`❌ Falha na API PageSpeed (${strategy}): ${errorMessage}`);
      }
      
      // Process successful response
      const data = await response.json();
      console.log(`✅ Resposta da API PageSpeed recebida para ${strategy}`);
      
      // Log some basic metrics if available
      if (data?.lighthouseResult?.audits) {
        const metrics = data.lighthouseResult.audits;
        if (metrics['first-contentful-paint']) {
          console.log(`⏰ FCP: ${metrics['first-contentful-paint'].displayValue}`);
        }
        if (metrics['largest-contentful-paint']) {
          console.log(`⏰ LCP: ${metrics['largest-contentful-paint'].displayValue}`);
        }
      }
      
      const processedData = processPageInsightsData(data, url);
      
      // Store in memory cache (faster)
      storeInMemoryCache(cacheKey, processedData);
      console.log(`💾 Dados armazenados em cache de memória para ${strategy}`);
      
      // Cache in sessionStorage too
      storeInSessionStorage(cacheKey, processedData);
      console.log(`💾 Dados armazenados em sessionStorage para ${strategy}`);
      
      return processedData;
    } catch (apiError: any) {
      console.error(`❌ Falha na chamada à API para ${strategy}:`, apiError.message);
      
      if (apiError.message === 'Timeout') {
        console.warn(`⏱️ Timeout excedido para ${strategy} após ${timeoutMs}ms`);
        
        // Try alternative with CORS Proxy for timeouts
        try {
          console.log(`🔄 Tentando via proxy CORS para ${strategy}`);
          const corsData = await handleCorsRequest(url, strategy);
          if (corsData) {
            console.log(`✅ Dados obtidos via proxy CORS para ${strategy}`);
            const processedData = processPageInsightsData(corsData, url);
            storeInMemoryCache(cacheKey, processedData);
            return processedData;
          }
        } catch (corsError: any) {
          console.warn(`❌ Falha no proxy CORS para ${strategy}:`, corsError.message);
        }
        
        throw new Error(`⏱️ Timeout excedido ao conectar com a API PageSpeed Insights para ${strategy}. Tente novamente mais tarde.`);
      }
      
      // Keep detection of specific errors
      if (isApiNotEnabledError(apiError.message)) {
        // API not enabled error
        throw apiError;
      }
      
      // Create detailed error message
      const errorMessage = createDetailedErrorMessage(url, strategy, apiError, apiKey);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error(`❌ Erro crítico em getPageInsightsData para ${strategy}:`, error.message);
    throw error; // Propagate error to be handled by component
  }
}

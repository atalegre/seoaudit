
import type { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';
import { getFromMemoryCache, getFromSessionStorage, storeInMemoryCache, storeInSessionStorage } from './cacheService';
import { createCacheKey } from './apiConfig';
import { supabase } from '@/integrations/supabase/client';
import { createDetailedErrorMessage } from './errorHandler';

/**
 * Fetch data from PageSpeed Insights API via Supabase Edge Function
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
    
    // Normalize URL (add https:// if not specified)
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    console.log(`🔗 URL normalizada para análise: ${normalizedUrl}`);
    
    // Get user ID if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;
    
    console.log(`👤 Usuário para análise: ${userId ? 'Autenticado' : 'Visitante'}`);
    
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('seo-analysis', {
      body: {
        url: normalizedUrl,
        strategy,
        userId
      }
    });
    
    if (error) {
      console.error(`❌ Erro na função seo-analysis:`, error);
      throw new Error(`Falha na função Edge: ${error.message}`);
    }
    
    if (!data || data.error) {
      const errorMessage = data?.error || 'Resposta inválida da API';
      console.error(`❌ Erro retornado pela função:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    if (!data.data) {
      console.error(`❌ Dados ausentes na resposta:`, data);
      throw new Error('Resposta da API não contém dados PageSpeed');
    }
    
    console.log(`✅ Resposta do PageSpeed recebida para ${strategy} (requestId: ${data.requestId})`);
    
    // Process the response data
    const processedData = processPageInsightsData(data.data, url);
    
    // Store in memory cache (faster)
    storeInMemoryCache(cacheKey, processedData);
    console.log(`💾 Dados armazenados em cache de memória para ${strategy}`);
    
    // Cache in sessionStorage too
    storeInSessionStorage(cacheKey, processedData);
    console.log(`💾 Dados armazenados em sessionStorage para ${strategy}`);
    
    return processedData;
  } catch (error: any) {
    console.error(`❌ Erro crítico em getPageInsightsData para ${strategy}:`, error.message);
    
    // Create a more helpful error message
    const detailedError = createDetailedErrorMessage(url, strategy, error, "API Key protegida no servidor");
    throw new Error(detailedError);
  }
}


import { getApiKey } from '../supabaseClient';
import { toast } from 'sonner';
import { createTimedRequest } from './corsHandlers';
import { PageInsightsData } from './types';
import { processPageInsightsData } from './apiProcessor';

// Cache aprimorado com TTL e compressão de chaves
const apiRequestCache = new Map<string, Promise<PageInsightsData>>();
const API_CACHE_TTL = 1000 * 60 * 30; // 30 minutos

/**
 * Get Google Page Insights data for a URL with improved optimization
 * @param url URL to analyze
 * @returns Page Insights data
 */
export async function fetchPageInsightsData(url: string): Promise<PageInsightsData> {
  console.log('Starting Google Page Insights analysis for URL:', url);
  
  // Normalize URL for consistent caching - improved cache hit rate
  const normalizedUrl = url.toLowerCase().trim().replace(/^https?:\/\//, '');
  const cacheKey = `pageInsights_${normalizedUrl}`;
  
  // Check for an in-flight request to prevent duplicate calls
  const cachedRequest = apiRequestCache.get(cacheKey);
  if (cachedRequest) {
    console.log('Using in-flight request for', normalizedUrl);
    return cachedRequest;
  }
  
  // Create a new promise and store it in the cache
  const fetchPromise = (async () => {
    // Try to get API key from Supabase first
    let apiKey = await getApiKey('googlePageInsightsKey');
    
    // Fall back to localStorage if not found in Supabase
    if (!apiKey) {
      apiKey = localStorage.getItem('googlePageInsightsKey');
      console.log('API key from localStorage:', apiKey ? 'Found' : 'Not found');
    }
    
    // Se não houver chave API, retornar objeto formatado em vez de lançar exceção
    if (!apiKey) {
      console.error('No API key available for Google Page Insights');
      toast.error('Chave da API Google Page Insights necessária', {
        description: 'Configure sua chave API nas Configurações para obter dados SEO.',
        duration: 5000,
      });
      
      const errorData: PageInsightsData = {
        url: url,
        score: 0,
        performanceScore: 0,
        loadTimeDesktop: 0,
        loadTimeMobile: 0,
        mobileFriendly: false,
        security: false,
        imageOptimization: 0,
        lcp: 0,
        cls: 0,
        fid: 0,
        errorMessage: 'Chave API do Google Page Insights não configurada. Configure nas configurações.',
        isError: true
      };
      
      return errorData;
    }

    toast('Analisando SEO com Google Page Insights...', {
      description: 'Isso pode levar alguns segundos.',
    });

    // Construct API URL with proper query parameters
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=seo&category=best-practices`;
    
    console.log('Fetching Google Page Insights data');
    
    // Create timed request with abort controller - max 10 seconds for mobile connections
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 20000); // Aumentado para 20 segundos
    
    try {
      const response = await fetch(apiUrl, fetchProps);
      
      clearTimeout();
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP Status: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          
          // Check for specific error types from the Google API
          if (errorData.error?.status === 'INVALID_ARGUMENT') {
            errorMessage = 'URL inválida ou não acessível pelo Google';
            console.error('Invalid URL error:', errorData.error);
          } else if (errorData.error?.status === 'PERMISSION_DENIED') {
            errorMessage = 'Chave API Google Page Insights inválida ou expirada';
            console.error('API key error:', errorData.error);
            toast.error('Erro de API Google', {
              description: 'Sua chave API pode estar inválida ou expirada. Verifique nas Configurações.',
            });
          } else if (errorData.error?.message) {
            errorMessage = errorData.error.message;
            console.error('API error message:', errorData.error.message);
          }
        } catch (e) {
          console.error('Failed to parse error response:', errorText);
        }
        
        console.error(errorMessage);
        
        // Retornar objeto formatado com erro em vez de lançar exceção
        return {
          url: url,
          score: 0,
          performanceScore: 0,
          loadTimeDesktop: 0,
          loadTimeMobile: 0,
          mobileFriendly: false,
          security: false,
          imageOptimization: 0,
          lcp: 0,
          cls: 0,
          fid: 0,
          errorMessage: `Erro na API do Google: ${errorMessage}`,
          isError: true
        };
      }
      
      const data = await response.json();
      console.log('Google Page Insights API response received:', data.lighthouseResult ? 'Valid data' : 'Invalid data');
      
      if (!data.lighthouseResult) {
        return {
          url: url,
          score: 0,
          performanceScore: 0,
          loadTimeDesktop: 0,
          loadTimeMobile: 0,
          mobileFriendly: false,
          security: false,
          imageOptimization: 0,
          lcp: 0,
          cls: 0,
          fid: 0,
          errorMessage: 'API Google retornou dados incompletos ou inválidos',
          isError: true
        };
      }
      
      return processPageInsightsData(data, url);
    } catch (fetchError: any) {
      clearTimeout();
      
      // Retornar objeto formatado com erro em vez de lançar exceção
      if (fetchError.name === 'AbortError') {
        console.error('Google Page Insights API request timed out');
        return {
          url: url,
          score: 0,
          performanceScore: 0,
          loadTimeDesktop: 0,
          loadTimeMobile: 0,
          mobileFriendly: false,
          security: false,
          imageOptimization: 0,
          lcp: 0,
          cls: 0,
          fid: 0,
          errorMessage: 'Tempo limite da API excedido. Tente novamente mais tarde.',
          isError: true
        };
      } else {
        console.error('Fetch error:', fetchError.message);
        return {
          url: url,
          score: 0,
          performanceScore: 0,
          loadTimeDesktop: 0,
          loadTimeMobile: 0,
          mobileFriendly: false,
          security: false,
          imageOptimization: 0,
          lcp: 0,
          cls: 0,
          fid: 0,
          errorMessage: fetchError.message || 'Erro ao acessar a API do Google',
          isError: true
        };
      }
    } finally {
      // Remove in-flight request after a delay to prevent immediate re-fetching
      setTimeout(() => {
        apiRequestCache.delete(cacheKey);
      }, API_CACHE_TTL);
    }
  })();
  
  // Store the promise in the cache
  apiRequestCache.set(cacheKey, fetchPromise);
  
  return fetchPromise;
}

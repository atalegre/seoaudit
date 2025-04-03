
import { getApiKey } from '../supabaseClient';
import { toast } from 'sonner';
import { createTimedRequest } from './corsHandlers';
import { generateLocalPageInsights } from './mockDataGenerator';
import { processPageInsightsData } from './apiProcessor';
import { PageInsightsData } from './types';

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
    
    // Use local analyzer if no API key is available
    if (!apiKey) {
      console.log('No API key, using local analyzer');
      toast.warning('Chave da API Google Page Insights não encontrada', {
        description: 'Configure sua chave API nas Configurações para obter dados SEO precisos.',
        duration: 5000,
      });
      
      // Simulate a delay to prevent hammering local generation
      await new Promise(resolve => setTimeout(resolve, 100));
      return generateLocalPageInsights(url);
    }

    toast('Analisando SEO com Google Page Insights...', {
      description: 'Isso pode levar alguns segundos.',
    });

    // Construct API URL with proper query parameters
    // Using a direct fetch with full control over parameters
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=seo&category=best-practices`;
    
    console.log('Fetching Google Page Insights data');
    
    // Create timed request with abort controller - max 10 seconds for mobile connections
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 10000);
    
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
        toast.warning('Falha na API do Google', {
          description: 'Usando analisador local para dados de SEO.',
        });
        return generateLocalPageInsights(url);
      }
      
      const data = await response.json();
      console.log('Google Page Insights API response received:', data.lighthouseResult ? 'Valid data' : 'Invalid data');
      
      return processPageInsightsData(data, url);
    } catch (fetchError: any) {
      clearTimeout();
      if (fetchError.name === 'AbortError') {
        console.error('Google Page Insights API request timed out');
        toast.warning('Tempo limite excedido', {
          description: 'A API do Google não respondeu a tempo. Usando analisador local para dados de SEO.'
        });
        return generateLocalPageInsights(url);
      } else {
        console.error('Fetch error:', fetchError.message);
        toast.warning('Falha na API do Google', {
          description: 'Usando analisador local para dados de SEO.',
        });
        return generateLocalPageInsights(url);
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

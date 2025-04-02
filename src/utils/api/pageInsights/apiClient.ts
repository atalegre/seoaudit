
import { getApiKey } from '../supabaseClient';
import { toast } from 'sonner';
import { createTimedRequest } from './corsHandlers';
import { generateLocalPageInsights } from './mockDataGenerator';
import { processPageInsightsData } from './apiProcessor';
import { PageInsightsData } from './types';

/**
 * Get Google Page Insights data for a URL
 * @param url URL to analyze
 * @returns Page Insights data
 */
export async function fetchPageInsightsData(url: string): Promise<PageInsightsData> {
  console.log('Starting Google Page Insights analysis for URL:', url);
  
  // Try to get API key from Supabase
  let apiKey = await getApiKey('googlePageInsightsKey');
  console.log('API key from Supabase:', apiKey ? 'Found' : 'Not found');
  
  // Fall back to localStorage if not found in Supabase
  if (!apiKey) {
    apiKey = localStorage.getItem('googlePageInsightsKey');
    console.log('API key from localStorage:', apiKey ? 'Found' : 'Not found');
  }
  
  // Use local analyzer if no API key is available
  if (!apiKey) {
    console.error('Google Page Insights API key not found in Supabase or localStorage');
    toast.warning('Chave da API Google Page Insights não encontrada', {
      description: 'Usando analisador local para dados de SEO.',
    });
    
    return generateLocalPageInsights(url);
  }

  toast('Analisando SEO com Google Page Insights...', {
    description: 'Isso pode levar alguns segundos.',
  });

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=seo&category=best-practices`;
  
  console.log('Fetching Google Page Insights data from:', apiUrl.replace(apiKey, '[API_KEY_HIDDEN]'));
  
  // Create timed request with abort controller
  const { fetchProps, clearTimeout } = createTimedRequest(apiUrl);
  
  try {
    const response = await fetch(apiUrl, fetchProps);
    
    clearTimeout();
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP Status: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        console.error('Google Page Insights API error:', errorData);
        
        // Check for specific errors
        if (errorData.error?.status === 'INVALID_ARGUMENT') {
          errorMessage = 'URL inválida ou não acessível pelo Google';
        } else if (errorData.error?.status === 'PERMISSION_DENIED') {
          errorMessage = 'Chave API Google Page Insights inválida ou expirada';
          toast.error('Erro de API Google', {
            description: 'Sua chave API pode estar inválida ou expirada. Verifique as configurações.',
          });
        } else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
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
    console.log('Google Page Insights API response received successfully');
    
    // Log a small portion of the response to avoid flooding the console
    if (data) {
      console.log('API response preview:', 
        JSON.stringify({
          kind: data.kind,
          id: data.id,
          responseCode: data.responseCode,
          analysisUTCTimestamp: data.analysisUTCTimestamp
        })
      );
    }
    
    return processPageInsightsData(data, url);
  } catch (fetchError) {
    clearTimeout();
    if (fetchError.name === 'AbortError') {
      console.error('Google Page Insights API request timed out after 8 seconds');
      toast.warning('Tempo limite excedido', {
        description: 'Usando analisador local para dados de SEO.'
      });
      return generateLocalPageInsights(url);
    } else {
      console.error('Fetch error:', fetchError.message);
      toast.warning('Falha na API do Google', {
        description: 'Usando analisador local para dados de SEO.',
      });
      return generateLocalPageInsights(url);
    }
  }
}

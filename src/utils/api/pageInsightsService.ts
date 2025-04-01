
import { analyzeSite } from '../analyzerUtils';
import { getApiKey } from './supabaseClient';

// Função para obter os dados do Google Page Insights
export async function getPageInsightsData(url: string): Promise<any> {
  // Primeiro tenta obter a chave da API do Supabase
  let apiKey = await getApiKey('googlePageInsightsKey');
  
  // Se não encontrou no Supabase, tenta do localStorage como fallback
  if (!apiKey) {
    apiKey = localStorage.getItem('googlePageInsightsKey');
  }
  
  if (!apiKey) {
    console.error('Google Page Insights API key not found');
    // Usa dados simulados quando a chave da API não está disponível
    return analyzeSite(url).seo;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Page Insights data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Page Insights data:', error);
    // Fallback para dados simulados
    return analyzeSite(url).seo;
  }
}


import { fetchPageInsightsData } from './apiClient';
import { generateLocalPageInsights } from './mockDataGenerator';
import { toast } from 'sonner';
import { PageInsightsData } from './types';

/**
 * Get Page Insights data for a URL with improved error handling
 * @param url URL to analyze
 * @returns Promise with Page Insights data
 */
export async function getPageInsightsData(url: string): Promise<PageInsightsData> {
  try {
    console.log('Getting Page Insights data for:', url);
    return await fetchPageInsightsData(url);
  } catch (error) {
    console.error('Error fetching Page Insights data:', error);
    
    // Mostrar toast com mensagem de erro
    toast.error('Erro na análise SEO', {
      description: error instanceof Error ? error.message : 'Não foi possível obter dados de SEO. Configure sua chave API.',
    });
    
    // Retornar objeto formatado de erro em vez de lançar exceção
    return generateLocalPageInsights(url);
  }
}

// Export types and utility functions
export * from './types';
export { generateLocalPageInsights } from './mockDataGenerator';
export { processPageInsightsData, getAuditImportance } from './apiProcessor';

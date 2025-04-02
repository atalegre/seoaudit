
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
    return await fetchPageInsightsData(url);
  } catch (error) {
    console.error('Error fetching Page Insights data:', error);
    toast.warning('Erro na análise externa', {
      description: 'Usando analisador local para dados de SEO.',
    });
    
    return generateLocalPageInsights(url);
  }
}

// Export types and utility functions
export * from './types';
export { generateLocalPageInsights } from './mockDataGenerator';
export { processPageInsightsData, getAuditImportance } from './apiProcessor';

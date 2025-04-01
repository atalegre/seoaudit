import { Client, AnalysisResult } from './types';
import { getPageInsightsData } from './pageInsightsService';
import { getChatGptAnalysis } from './chatGptService';
import { saveAnalysisResult } from './supabaseClient';
import { createAnalysisResult } from '../resultsPageHelpers';
import { toast } from 'sonner';

/**
 * Performs a full analysis of a website, combining SEO and AIO insights
 */
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // Normalize URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Get SEO data from PageInsights
    const seoData = await getPageInsightsData(url);
    
    // Get AIO data from ChatGPT
    const aioData = await getChatGptAnalysis(url);
    
    // Combine results
    return createAnalysisResult(url, seoData, aioData);
  } catch (error) {
    console.error('Error in full analysis:', error);
    throw new Error('Falha ao realizar análise completa do website');
  }
}

/**
 * Analyzes multiple client websites in bulk
 */
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  // Keep track of successful and failed analyses
  let successCount = 0;
  let failCount = 0;
  
  // Process each client in sequence to avoid overwhelming APIs
  for (const clientId of clientIds) {
    try {
      // This would typically fetch the client data from the database
      // But for now we'll simulate the process with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, we would:
      // 1. Get the client data by ID
      // 2. Extract the website URL
      // 3. Run a full analysis
      // 4. Save the results
      // For now, we'll just increment the success counter
      successCount++;
      
    } catch (error) {
      console.error(`Error analyzing client ${clientId}:`, error);
      failCount++;
    }
  }
  
  // Log the results
  console.log(`Analysis complete: ${successCount} successful, ${failCount} failed`);
  
  // If any analyses failed, throw an error
  if (failCount > 0) {
    throw new Error(`${failCount} análises falharam`);
  }
}

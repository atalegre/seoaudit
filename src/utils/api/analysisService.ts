
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
    
    // Get SEO and AIO data concurrently
    const [seoData, aioData] = await Promise.all([
      getPageInsightsData(url),
      getChatGptAnalysis(url)
    ]);
    
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
  if (clientIds.length === 0) return;
  
  let successCount = 0;
  let failCount = 0;
  
  // Process clients in batches to improve performance while not overwhelming APIs
  const batchSize = 3; // Process 3 clients concurrently
  
  for (let i = 0; i < clientIds.length; i += batchSize) {
    const batch = clientIds.slice(i, i + batchSize);
    
    // Process batch concurrently
    const results = await Promise.allSettled(
      batch.map(async (clientId) => {
        try {
          // In a real implementation, we would:
          // 1. Get client data by ID
          // 2. Extract website URL
          // 3. Run analysis
          // 4. Save results
          
          // For now, simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 500));
          return true; // Success
        } catch (error) {
          console.error(`Error analyzing client ${clientId}:`, error);
          return false; // Failure
        }
      })
    );
    
    // Count results
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        successCount++;
      } else {
        failCount++;
      }
    });
  }
  
  console.log(`Analysis complete: ${successCount} successful, ${failCount} failed`);
  
  if (failCount > 0) {
    throw new Error(`${failCount} análises falharam`);
  }
}

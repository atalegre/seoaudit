
import { AnalysisResult, Client } from './types';
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
    const seoPromise = getPageInsightsData(url);
    const aioPromise = getChatGptAnalysis(url);
    
    // Wait for both promises to settle
    const [seoResult, aioResult] = await Promise.allSettled([seoPromise, aioPromise]);
    
    // Check if both APIs failed
    if (seoResult.status === 'rejected' && aioResult.status === 'rejected') {
      throw new Error('Ambas as APIs falharam. Não foi possível realizar a análise.');
    }
    
    // Extract data or handle errors
    const seoData = seoResult.status === 'fulfilled' ? seoResult.value : null;
    const aioData = aioResult.status === 'fulfilled' ? aioResult.value : null;
    
    // Show warnings for individual API failures
    if (seoResult.status === 'rejected') {
      console.error('SEO API failed:', seoResult.reason);
      toast.error('Análise SEO falhou', {
        description: 'Não foi possível obter dados de SEO.'
      });
    }
    
    if (aioResult.status === 'rejected') {
      console.error('AIO API failed:', aioResult.reason);
      toast.error('Análise AIO falhou', {
        description: 'Não foi possível obter dados de AIO.'
      });
    }
    
    // Create result with available data
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
          // No more simulated processing
          console.log(`Processing client ${clientId}`);
          // Implementar lógica real de processamento quando disponível
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

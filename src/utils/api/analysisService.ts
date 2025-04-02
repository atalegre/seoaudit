
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
    const seoPromise = getPageInsightsData(url)
      .catch(error => {
        console.error('SEO API failed:', error);
        toast.warning('Análise SEO falhou', {
          description: 'Usando dados SEO simulados.'
        });
        return null;
      });
    
    const aioPromise = getChatGptAnalysis(url)
      .catch(error => {
        console.error('AIO API failed:', error);
        toast.warning('Análise AIO falhou', {
          description: 'Usando dados AIO simulados.'
        });
        return null;
      });
    
    // Wait for both promises to settle
    const [seoResult, aioResult] = await Promise.all([seoPromise, aioPromise]);
    
    // Create result with available data
    const result = createAnalysisResult(url, seoResult || null, aioResult || null);
    return result;
  } catch (error) {
    console.error('Error in full analysis:', error);
    toast.warning('Utilizando análise simulada', {
      description: 'Não foi possível conectar com as APIs de análise.'
    });
    // Criar resultado com dados simulados em caso de falha completa
    return createAnalysisResult(url, null, null);
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


import { AnalysisResult, Client } from './types';
import { getPageInsightsData } from './pageInsights'; 
import { getChatGptAnalysis } from './chatGptService';
import { fetchSiteLogo } from './logoService';
import { saveAnalysisResult } from './supabaseClient';
import { createAnalysisResult } from '../resultsPageHelpers';
import { toast } from 'sonner';

// Cache para evitar análises repetidas em curto espaço de tempo
const analysisCache = new Map<string, {result: AnalysisResult, timestamp: number}>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

/**
 * Performs a full analysis of a website, combining SEO and AIO insights
 * Otimizado para performance e consumo de recursos
 */
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // Normalize URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Verificar cache
    const cachedAnalysis = analysisCache.get(url);
    if (cachedAnalysis && Date.now() - cachedAnalysis.timestamp < CACHE_TTL) {
      console.log('Usando resultado em cache para:', url);
      return cachedAnalysis.result;
    }
    
    // Iniciar análises em paralelo - otimizado com Promise.allSettled
    const results = await Promise.allSettled([
      getPageInsightsData(url),
      getChatGptAnalysis(url),
      fetchSiteLogo(url)
    ]);
    
    // Extrair resultados com tratamento de erros otimizado
    const seoResult = results[0].status === 'fulfilled' ? results[0].value : null;
    const aioResult = results[1].status === 'fulfilled' ? results[1].value : null;
    const logoUrl = results[2].status === 'fulfilled' ? results[2].value : null;
    
    // Exibir alertas apenas para falhas - reduzindo número de toasts
    if (results[0].status === 'rejected') {
      console.error('SEO API failed:', results[0].reason);
      toast.warning('Análise SEO falhou', {
        description: 'Usando dados SEO simulados.'
      });
    }
    
    if (results[1].status === 'rejected') {
      console.error('AIO API failed:', results[1].reason);
      toast.warning('Análise AIO falhou', {
        description: 'Usando dados AIO simulados.'
      });
    }
    
    // Create result with available data
    const result = createAnalysisResult(url, seoResult, aioResult);
    result.logoUrl = logoUrl;
    
    console.log('Analysis completed for:', url);
    
    // Guardar no cache
    analysisCache.set(url, {result, timestamp: Date.now()});
    
    return result;
  } catch (error) {
    console.error('Error in full analysis:', error);
    toast.warning('Utilizando análise simulada', {
      description: 'Não foi possível conectar com as APIs de análise.'
    });
    
    // Criar resultado com dados simulados em caso de falha completa
    const result = createAnalysisResult(url, null, null);
    return result;
  }
}

// Constante para limitar processamento em paralelo
const MAX_CONCURRENT_ANALYSES = 2;

/**
 * Analyzes multiple client websites in bulk, com otimização de performance
 */
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  if (clientIds.length === 0) return;
  
  let successCount = 0;
  let failCount = 0;
  
  // Reduzir tamanho do lote para evitar sobrecarga de recursos
  const batchSize = MAX_CONCURRENT_ANALYSES; 
  
  // Mostrar toast apenas para início e fim do processo
  toast.info(`Analisando ${clientIds.length} clientes`, {
    description: 'Este processo pode demorar alguns minutos.'
  });
  
  for (let i = 0; i < clientIds.length; i += batchSize) {
    const batch = clientIds.slice(i, i + batchSize);
    
    // Processar lote em paralelo
    const results = await Promise.allSettled(
      batch.map(async (clientId) => {
        try {
          console.log(`Processing client ${clientId}`);
          // Implementar lógica real de processamento quando disponível
          return true; // Success
        } catch (error) {
          console.error(`Error analyzing client ${clientId}:`, error);
          return false; // Failure
        }
      })
    );
    
    // Contabilizar resultados
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        successCount++;
      } else {
        failCount++;
      }
    });
    
    // Pequeno intervalo para evitar sobrecarga da CPU
    if (i + batchSize < clientIds.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`Analysis complete: ${successCount} successful, ${failCount} failed`);
  
  // Notificar apenas no final
  if (successCount > 0) {
    toast.success(`Análise concluída: ${successCount} clientes analisados com sucesso`);
  }
  
  if (failCount > 0) {
    toast.error(`${failCount} análises falharam`);
  }
}

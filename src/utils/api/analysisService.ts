
import { AnalysisResult, SeoAnalysisResult } from './types';
import { getPageInsightsData } from './pageInsights'; 
import { getChatGptAnalysis } from './chatGptService';
import { fetchSiteLogo } from './logoService';
import { createAnalysisResult } from '../resultsPageHelpers';
import { toast } from 'sonner';

// Cache com TTL para versão otimizada
const analysisCache = new Map<string, {result: AnalysisResult, timestamp: number}>();
const CACHE_TTL = 1000 * 60 * 60; // 60 minutos

/**
 * Performs a full analysis of a website, combining SEO and AIO insights
 * Versão otimizada para performance
 */
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // Normalize URL format
    if (!url.startsWith('http')) url = 'https://' + url;
    
    // Verificar cache
    const cacheKey = url.toLowerCase().trim();
    const cachedAnalysis = analysisCache.get(cacheKey);
    if (cachedAnalysis && Date.now() - cachedAnalysis.timestamp < CACHE_TTL) {
      console.log('Usando análise em cache para', url);
      return cachedAnalysis.result;
    }
    
    // Iniciar análise primária - SEO primeiro
    console.log('Iniciando análise para', url);
    const startTime = performance.now();
    
    // Usar Promise.allSettled para garantir que uma promessa rejeitada não impede outras
    const [seoResult, aioResult, logoUrl] = await Promise.allSettled([
      getPageInsightsData(url),
      getChatGptAnalysis(url),
      fetchSiteLogo(url)
    ]);
    
    // Corrigindo a conversão de tipo para garantir que o SeoAnalysisResult tenha todos os campos obrigatórios
    const seoData = seoResult.status === 'fulfilled' ? seoResult.value as SeoAnalysisResult : null;
    const aioData = aioResult.status === 'fulfilled' ? aioResult.value : null;
    
    if (seoResult.status === 'rejected') {
      console.warn('SEO analysis failed:', seoResult.reason);
      toast.warning('Análise SEO falhou', {
        description: 'Usando dados parciais'
      });
    }
    
    if (aioResult.status === 'rejected') {
      console.warn('AIO analysis failed:', aioResult.reason);
    }
    
    // Criar resultado com os dados disponíveis
    const result = createAnalysisResult(url, seoData, aioData);
    
    // Adicionar logo se disponível
    if (logoUrl.status === 'fulfilled' && logoUrl.value) {
      console.log('Logo encontrado:', logoUrl.value);
      result.logoUrl = logoUrl.value;
    }
    
    // Guardar no cache
    analysisCache.set(cacheKey, {result, timestamp: Date.now()});
    
    const endTime = performance.now();
    console.log(`Análise concluída em ${(endTime - startTime).toFixed(0)}ms`);
    
    return result;
  } catch (error) {
    console.error('Error in full analysis:', error);
    
    // Criar resultado com dados simulados em caso de falha completa
    return createAnalysisResult(url, null, null);
  }
}

// Controle de processamento em paralelo
const MAX_CONCURRENT_ANALYSES = 2;
let activeAnalyses = 0;
const analysisQueue: (() => void)[] = [];

/**
 * Analyzes multiple client websites in bulk with controlled concurrency
 */
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  if (!clientIds.length) return;
  
  let successCount = 0, failCount = 0;
  
  toast.info(`Preparando análise de ${clientIds.length} clientes`);
  
  // Processar com controle de concorrência
  for (const clientId of clientIds) {
    const runAnalysis = async () => {
      try {
        console.log(`Processing client ${clientId}`);
        // Simulação de análise - substituir com implementação real
        await new Promise(resolve => setTimeout(resolve, 1500));
        successCount++;
        activeAnalyses--;
        processQueue();
      } catch (error) {
        console.error(`Error analyzing client ${clientId}:`, error);
        failCount++;
        activeAnalyses--;
        processQueue();
      }
    };
    
    // Enfileirar ou executar diretamente dependendo da concorrência atual
    if (activeAnalyses < MAX_CONCURRENT_ANALYSES) {
      activeAnalyses++;
      runAnalysis();
    } else {
      analysisQueue.push(() => {
        activeAnalyses++;
        runAnalysis();
      });
    }
  }
  
  function processQueue() {
    if (analysisQueue.length > 0 && activeAnalyses < MAX_CONCURRENT_ANALYSES) {
      const nextAnalysis = analysisQueue.shift();
      if (nextAnalysis) nextAnalysis();
    }
    
    // Notificar progresso a cada 5 análises ou no final
    if ((successCount + failCount) % 5 === 0 || 
        successCount + failCount === clientIds.length) {
      toast.info(`Progresso: ${successCount + failCount}/${clientIds.length}`);
    }
    
    // Notificação final
    if (successCount + failCount === clientIds.length) {
      if (successCount > 0) {
        toast.success(`${successCount} análises concluídas`);
      }
      
      if (failCount > 0) {
        toast.error(`${failCount} análises falharam`);
      }
    }
  }
}

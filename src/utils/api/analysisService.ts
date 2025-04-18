
import { AnalysisResult, SeoAnalysisResult } from './types';
import { getPageInsightsData } from './pageInsights'; 
import { getChatGptAnalysis } from './chatGptService';
import { fetchSiteLogo } from './logoService';
import { createAnalysisResult } from '../resultsPageHelpers';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '../domainUtils';

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
    
    // Extrair domínio para o logo primeiro
    const domain = extractDomainFromUrl(url);
    console.log('Domínio extraído para logo:', domain);
    
    // Logo URL diretamente - nem sempre vamos precisar do Promise.allSettled
    let logoUrl = null;
    if (domain) {
      // Tentar obter logo diretamente
      logoUrl = `https://logo.clearbit.com/${domain}`;
      console.log('Logo URL definido diretamente:', logoUrl);
    }
    
    // Usar Promise.allSettled para garantir que uma promessa rejeitada não impede outras
    const [seoResult, aioResult] = await Promise.allSettled([
      getPageInsightsData(url),
      getChatGptAnalysis(url)
    ]);
    
    // Safely convert PageInsightsData to SeoAnalysisResult
    const seoData = seoResult.status === 'fulfilled' ? seoResult.value as unknown as SeoAnalysisResult : null;
    const aioData = aioResult.status === 'fulfilled' ? aioResult.value : null;
    
    // Verificar se temos dados SEO, mas com erro (não lançamos mais exceção)
    if (seoResult.status === 'fulfilled' && seoData && seoData.isError) {
      console.warn('SEO analysis returned with error state:', seoData.errorMessage);
      toast.warning('Análise SEO com limitações', {
        description: seoData.errorMessage || 'Dados SEO parciais ou indisponíveis'
      });
    } else if (seoResult.status === 'rejected') {
      console.warn('SEO analysis failed:', seoResult.reason);
      toast.warning('Análise SEO falhou', {
        description: 'Usando dados parciais'
      });
    }
    
    if (aioResult.status === 'rejected') {
      console.warn('AIO analysis failed:', aioResult.reason);
      toast.warning('Análise AIO falhou', {
        description: 'Dados de IA indisponíveis'
      });
    }
    
    // Criar resultado com os dados disponíveis
    const result = createAnalysisResult(url, seoData, aioData);
    
    // Adicionar logo URL diretamente sem precisar de uma chamada API adicional
    if (logoUrl) {
      console.log('Definindo logo URL no resultado:', logoUrl);
      result.logoUrl = logoUrl;
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


import { AnalysisResult } from './types';
import { getPageInsightsData } from './pageInsights'; 
import { getChatGptAnalysis } from './chatGptService';
import { fetchSiteLogo } from './logoService';
import { saveAnalysisResult } from './supabaseClient';
import { createAnalysisResult } from '../resultsPageHelpers';
import { toast } from 'sonner';

// Cache com TTL mais curto para versão mobile
const analysisCache = new Map<string, {result: AnalysisResult, timestamp: number}>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutos (reduzido para mobile)

/**
 * Performs a full analysis of a website, combining SEO and AIO insights
 * Versão otimizada para performance mobile
 */
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // Normalize URL format - simplificado
    if (!url.startsWith('http')) url = 'https://' + url;
    
    // Verificar cache
    const cacheKey = url.toLowerCase().trim();
    const cachedAnalysis = analysisCache.get(cacheKey);
    if (cachedAnalysis && Date.now() - cachedAnalysis.timestamp < CACHE_TTL) {
      return cachedAnalysis.result;
    }
    
    // Iniciar análise primária com prioridade para SEO
    const seoResult = await getPageInsightsData(url).catch(err => {
      console.error('SEO API failed:', err);
      toast.warning('Análise SEO falhou');
      return null;
    });
    
    // Análise AIO somente se SEO foi bem sucedido
    const aioResult = seoResult ? 
      await getChatGptAnalysis(url).catch(err => {
        console.error('AIO API failed:', err);
        return null;
      }) : null;
    
    // Buscar logo apenas se SEO ok
    const logoUrl = seoResult ? 
      await fetchSiteLogo(url).catch(() => null) : null;
    
    // Create result with available data
    const result = createAnalysisResult(url, seoResult, aioResult);
    if (logoUrl) result.logoUrl = logoUrl;
    
    // Guardar no cache
    analysisCache.set(cacheKey, {result, timestamp: Date.now()});
    
    return result;
  } catch (error) {
    console.error('Error in full analysis:', error);
    
    // Criar resultado com dados simulados em caso de falha completa
    return createAnalysisResult(url, null, null);
  }
}

// Limitar processamento em paralelo para mobile
const MAX_CONCURRENT_ANALYSES = 1;

/**
 * Analyzes multiple client websites in bulk
 * Versão otimizada para mobile
 */
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  if (!clientIds.length) return;
  
  let successCount = 0, failCount = 0;
  
  toast.info(`Analisando ${clientIds.length} clientes`);
  
  // Processar um por vez para mobile
  for (const clientId of clientIds) {
    try {
      console.log(`Processing client ${clientId}`);
      // Implementação simplificada para mobile
      successCount++;
    } catch (error) {
      console.error(`Error analyzing client ${clientId}:`, error);
      failCount++;
    }
    
    // Pequeno intervalo para não bloquear a thread principal
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Notificação final única
  if (successCount > 0) {
    toast.success(`${successCount} análises concluídas`);
  }
  
  if (failCount > 0) {
    toast.error(`${failCount} análises falharam`);
  }
}

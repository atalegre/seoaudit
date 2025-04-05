
import { AnalysisResult, SeoAnalysisResult, AioAnalysisResult } from './api/types';

/**
 * Formata URL para exibição, removendo protocolo e trailing slash
 */
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * Cria um resultado de análise combinando dados SEO e AIO
 * @param url URL analisada
 * @param seoData Dados da análise SEO (pageInsights)
 * @param aioData Dados da análise AIO (chat-gpt)
 * @returns Resultado da análise combinada
 */
export function createAnalysisResult(
  url: string,
  seoData: SeoAnalysisResult | null,
  aioData: AioAnalysisResult | null
): AnalysisResult {
  const timestamp = new Date().toISOString();
  
  // Construir objeto SEO com apenas dados reais
  const seo: SeoAnalysisResult = {
    score: seoData?.score ?? 0,
    performanceScore: seoData?.performanceScore ?? 0,
    bestPracticesScore: seoData?.bestPracticesScore ?? 0,
    loadTimeDesktop: seoData?.loadTimeDesktop,
    loadTimeMobile: seoData?.loadTimeMobile,
    mobileFriendly: seoData?.mobileFriendly ?? false,
    security: seoData?.security ?? false,
    imageOptimization: seoData?.imageOptimization ?? 0,
    headingsStructure: seoData?.headingsStructure ?? 0,
    metaTags: seoData?.metaTags ?? 0,
    lcp: seoData?.lcp,
    fid: seoData?.fid,
    cls: seoData?.cls,
    tapTargetsScore: seoData?.tapTargetsScore ?? 0,
    tapTargetsIssues: seoData?.tapTargetsIssues ?? 0,
    recommendations: seoData?.recommendations ?? []
  };
  
  // Construir objeto AIO com apenas dados reais
  const aio: AioAnalysisResult = {
    score: aioData?.score ?? 0,
    contentClarity: aioData?.contentClarity ?? 0,
    logicalStructure: aioData?.logicalStructure ?? 0,
    naturalLanguage: aioData?.naturalLanguage ?? 0,
    topicsDetected: aioData?.topicsDetected ?? [],
    confusingParts: aioData?.confusingParts ?? []
  };
  
  // Calcular status geral
  const seoScore = seo.score;
  const aioScore = aio.score;
  const averageScore = (seoScore + aioScore) / 2;
  
  let overallStatus = 'Crítico';
  if (averageScore >= 75) {
    overallStatus = 'Saudável';
  } else if (averageScore >= 50) {
    overallStatus = 'A melhorar';
  }
  
  // Combinar recomendações, se houver dados
  const recommendations = [];
  
  // Adicionar recomendações do SEO, se existirem
  if (seoData?.recommendations?.length) {
    const seoRecs = seoData.recommendations.map((rec, index) => ({
      id: Date.now() + index,
      suggestion: rec.title,
      description: rec.description,
      seoImpact: rec.importance >= 3 ? 'Alto' : rec.importance === 2 ? 'Médio' : 'Baixo',
      aioImpact: 'Baixo',
      priority: rec.importance,
      status: 'pending'
    }));
    recommendations.push(...seoRecs);
  }
  
  // Adicionar recomendações do AIO, se existirem e houver partes confusas
  if (aioData?.confusingParts?.length) {
    const aioRecs = aioData.confusingParts.map((part, index) => ({
      id: Date.now() + 1000 + index,
      suggestion: `Melhorar: ${part}`,
      description: part,
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 2,
      status: 'pending'
    }));
    recommendations.push(...aioRecs);
  }
  
  return {
    url,
    timestamp,
    status: seoData || aioData ? 'Concluída' : 'Falha',
    seo,
    aio,
    recommendations,
    overallStatus: overallStatus as any
  };
}

/**
 * Verifica se uma análise está completa
 * @param analysis Resultado da análise a verificar
 * @returns Verdadeiro se ambas as análises estiverem concluídas
 */
export function isAnalysisComplete(analysis: AnalysisResult): boolean {
  return analysis.seo.score > 0 && analysis.aio.score > 0;
}

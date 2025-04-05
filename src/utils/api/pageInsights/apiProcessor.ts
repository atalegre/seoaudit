
import { GooglePageInsightsResponse, PageInsightsData } from './types';

// Memoização de resultados para evitar processamento repetido
const resultsCache = new Map<string, {data: PageInsightsData, timestamp: number}>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 horas

/**
 * Process raw data from Google Page Insights API - versão mobile-first
 * @param data Google API response data
 * @param url The URL being analyzed
 * @returns Processed page insights data
 */
export function processPageInsightsData(data: GooglePageInsightsResponse, url: string): PageInsightsData {
  // Verificar cache primeiro
  const cacheKey = `${url.toLowerCase().trim()}_v2`;
  const cached = resultsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    // Extratores simplificados para reduzir complexidade
    const getScore = (category: string) => 
      Math.round(((data?.lighthouseResult?.categories?.[category as keyof typeof data.lighthouseResult.categories]?.score) || 0) * 100);
    
    const getAuditScore = (audit: string) => 
      data?.lighthouseResult?.audits?.[audit]?.score || 0;
      
    // Calcular pontuações principais
    const seoScore = getScore('seo');
    const performanceScore = getScore('performance');
    const bestPracticesScore = getScore('best-practices');
    
    // Core Web Vitals simplificados
    const lcpRaw = data?.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue;
    const lcp = lcpRaw ? Math.round(lcpRaw / 10) / 100 : 0;
    
    const fidRaw = data?.lighthouseResult?.audits?.['max-potential-fid']?.numericValue;
    const fid = fidRaw ? Math.round(fidRaw) : 0;
    
    const clsRaw = data?.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue;
    const cls = clsRaw ? Math.round(clsRaw * 100) / 100 : 0;
    
    // Tempos de carregamento
    const fcpMs = data?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile || 0;
    const loadTimeDesktop = fcpMs ? fcpMs / 1000 : 0;
    const loadTimeMobile = fcpMs ? (fcpMs * 1.5) / 1000 : 0;
    
    // Calculate headings structure and meta tags scores
    const headingsStructure = Math.round(getAuditScore('document-title') * 100);
    const metaTags = Math.round(getAuditScore('meta-description') * 100);
    
    // Core de dados simplificado
    const result: PageInsightsData = {
      score: seoScore,
      performanceScore,
      bestPracticesScore,
      url,
      loadTimeDesktop,
      loadTimeMobile,
      mobileFriendly: getAuditScore('viewport') > 0.9,
      security: getAuditScore('is-on-https') > 0.9,
      imageOptimization: Math.round(getAuditScore('uses-optimized-images') * 100),
      headingsStructure,
      metaTags,
      lcp,
      fid, 
      cls,
      tapTargetsScore: getAuditScore('tap-targets') * 100,
      tapTargetsIssues: 0
    };
    
    // Extrair recomendações apenas para os itens mais críticos (limitado para mobile)
    const criticalAudits = ['render-blocking-resources', 'unused-javascript', 'uses-responsive-images'];
    const audits = data?.lighthouseResult?.audits || {};
    
    result.recommendations = criticalAudits
      .filter(id => audits[id] && audits[id].score < 0.9)
      .map(id => ({
        id,
        title: audits[id].title || '',
        description: audits[id].description || '',
        importance: getAuditImportance(id)
      }))
      .slice(0, 5); // Limitar a 5 recomendações para mobile
    
    // Salvar no cache
    resultsCache.set(cacheKey, {data: result, timestamp: Date.now()});
    
    return result;
  } catch (error) {
    console.error('Error processing PageInsights data:', error);
    throw new Error('Falha ao processar dados da API PageInsights');
  }
}

// Lookup table otimizado para mobile
const auditImportanceMobile: Record<string, number> = {
  'render-blocking-resources': 3,
  'unused-javascript': 3,
  'uses-responsive-images': 3,
  'offscreen-images': 3,
  'total-byte-weight': 3,
  'largest-contentful-paint': 3
};

/**
 * Determine a importância de cada auditoria - simplificado para mobile
 * @param auditId O ID da auditoria do Google Page Insights
 * @returns Nível de importância (1-3)
 */
export function getAuditImportance(auditId: string): number {
  return auditImportanceMobile[auditId] || 1;
}

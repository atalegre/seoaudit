
import { GooglePageInsightsResponse, PageInsightsData } from './types';

// Memoização de resultados para evitar processamento repetido
const resultsCache = new Map<string, {data: PageInsightsData, timestamp: number}>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 horas

// Performance optimization: Pré-computar a lookup table de importâncias
const auditImportanceMobile: Record<string, number> = {
  'render-blocking-resources': 3,
  'unused-javascript': 3,
  'uses-responsive-images': 3,
  'offscreen-images': 3,
  'total-byte-weight': 3,
  'largest-contentful-paint': 3,
  'max-potential-fid': 3,
  'cumulative-layout-shift': 3
};

/**
 * Process raw data from Google Page Insights API - versão mobile-first otimizada
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
    // Otimização: Extrair dados com uma única navegação pela estrutura
    const lighthouse = data?.lighthouseResult || {};
    const categories = lighthouse.categories || {};
    const audits = lighthouse.audits || {};
    const metrics = data?.loadingExperience?.metrics || {};
    
    // Extrair pontuações em uma única passagem
    const seoScore = Math.round(((categories.seo?.score) || 0) * 100);
    const performanceScore = Math.round(((categories.performance?.score) || 0) * 100);
    const bestPracticesScore = Math.round(((categories['best-practices']?.score) || 0) * 100);
    
    // Extrair métricas web vitals em uma única passada
    const lcpRaw = audits['largest-contentful-paint']?.numericValue;
    const lcp = lcpRaw ? Math.round(lcpRaw / 10) / 100 : 0;
    
    const fidRaw = audits['max-potential-fid']?.numericValue;
    const fid = fidRaw ? Math.round(fidRaw) : 0;
    
    const clsRaw = audits['cumulative-layout-shift']?.numericValue;
    const cls = clsRaw ? Math.round(clsRaw * 100) / 100 : 0;
    
    // Tempos de carregamento
    const fcpMs = metrics.FIRST_CONTENTFUL_PAINT_MS?.percentile || 0;
    const loadTimeDesktop = fcpMs ? fcpMs / 1000 : 0;
    const loadTimeMobile = fcpMs ? (fcpMs * 1.5) / 1000 : 0;
    
    // Pontuações de estrutura e meta tags
    const headingsStructure = Math.round((audits['document-title']?.score || 0) * 100);
    const metaTags = Math.round((audits['meta-description']?.score || 0) * 100);
    
    // Otimização: Construir resultado otimizado para mobile
    const result: PageInsightsData = {
      score: seoScore,
      performanceScore,
      bestPracticesScore,
      url,
      loadTimeDesktop,
      loadTimeMobile,
      mobileFriendly: (audits.viewport?.score || 0) > 0.9,
      security: (audits['is-on-https']?.score || 0) > 0.9,
      imageOptimization: Math.round((audits['uses-optimized-images']?.score || 0) * 100),
      headingsStructure,
      metaTags,
      lcp,
      fid, 
      cls,
      tapTargetsScore: (audits['tap-targets']?.score || 0) * 100,
      tapTargetsIssues: 0
    };
    
    // Extrair recomendações críticas para mobile otimizado
    const criticalAudits = [
      'render-blocking-resources', 
      'unused-javascript', 
      'uses-responsive-images',
      'offscreen-images',
      'properly-sized-images',
      'unminified-css',
      'unminified-javascript',
      'first-contentful-paint',
      'largest-contentful-paint'
    ];
    
    // Otimização: Filtrar em uma única passada
    result.recommendations = criticalAudits
      .filter(id => audits[id] && audits[id].score < 0.9)
      .map(id => ({
        id,
        title: audits[id].title || '',
        description: audits[id].description || '',
        importance: getAuditImportance(id)
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5); // Limitar a 5 recomendações mais importantes para mobile
    
    // Salvar no cache
    resultsCache.set(cacheKey, {data: result, timestamp: Date.now()});
    
    return result;
  } catch (error) {
    console.error('Error processing PageInsights data:', error);
    throw new Error('Falha ao processar dados da API PageInsights');
  }
}

/**
 * Determine a importância de cada auditoria - otimizado
 * @param auditId O ID da auditoria do Google Page Insights
 * @returns Nível de importância (1-3)
 */
export function getAuditImportance(auditId: string): number {
  return auditImportanceMobile[auditId] || 1;
}

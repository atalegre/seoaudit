
import { GooglePageInsightsResponse, PageInsightsData } from './types';
import { generateLocalPageInsights } from './mockDataGenerator';

// Cache implementado para evitar processamento repetido
const resultsCache = new Map<string, PageInsightsData>();

/**
 * Process raw data from Google Page Insights API - com otimizações
 * @param data Google API response data
 * @param url The URL being analyzed
 * @returns Processed page insights data
 */
export function processPageInsightsData(data: GooglePageInsightsResponse, url: string): PageInsightsData {
  // Verificar cache primeiro
  const cacheKey = `${url}_${new Date().toDateString()}`; // Cache válido por um dia
  if (resultsCache.has(cacheKey)) {
    return resultsCache.get(cacheKey)!;
  }
  
  try {
    // Extrair dados com proteção contra valores undefined
    const getAuditScore = (auditName: string) => {
      return data?.lighthouseResult?.audits?.[auditName]?.score ?? 0;
    };
    
    const getNumericValue = (auditName: string) => {
      return data?.lighthouseResult?.audits?.[auditName]?.numericValue;
    };
    
    // Extrair scores - otimizado para evitar cálculos repetidos
    const seoScore = Math.round((data?.lighthouseResult?.categories?.seo?.score ?? 0.7) * 100);
    const performanceScore = Math.round((data?.lighthouseResult?.categories?.performance?.score ?? 0.65) * 100);
    const bestPracticesScore = Math.round((data?.lighthouseResult?.categories?.['best-practices']?.score ?? 0.75) * 100);
    
    // Extrair Core Web Vitals - com valores padrão sensatos
    const lcpValue = getNumericValue('largest-contentful-paint');
    const lcp = lcpValue ? Math.round(lcpValue / 10) / 100 : 3.5;
    
    const fidValue = getNumericValue('max-potential-fid');
    const fid = fidValue ? Math.round(fidValue) : 120;
    
    const clsValue = getNumericValue('cumulative-layout-shift');
    const cls = clsValue ? Math.round(clsValue * 100) / 100 : 0.15;
    
    // Extrair loading times
    const loadTimeDesktop = data?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 3.5;
    const loadTimeMobile = data?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 5.2;
    
    // Extrair mobile usability information
    const mobileFriendly = getAuditScore('viewport') === 1;
    const tapTargetsAudit = data?.lighthouseResult?.audits?.['tap-targets'];
    const tapTargetsScore = tapTargetsAudit?.score || 0;
    const tapTargetsDetails = tapTargetsAudit?.details?.items || [];
    
    // Extrair audits para recommendations - limitar processamento
    const audits = data?.lighthouseResult?.audits || {};
    const auditItems = Object.entries(audits)
      .filter(([_, audit]) => !audit.score || audit.score < 0.9)
      .slice(0, 20) // Limitar a 20 itens para processamento mais rápido
      .map(([key, audit]) => ({
        id: key,
        title: audit.title || '',
        description: audit.description || '',
        score: audit.score || 0,
        importance: getAuditImportance(key)
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
    
    // Construir resultado
    const result: PageInsightsData = {
      score: seoScore,
      performanceScore: performanceScore,
      bestPracticesScore: bestPracticesScore,
      url: url,
      loadTimeDesktop: loadTimeDesktop,
      loadTimeMobile: loadTimeMobile,
      mobileFriendly: mobileFriendly,
      security: getAuditScore('is-on-https') === 1,
      imageOptimization: Math.round((getAuditScore('uses-optimized-images') || 0.6) * 100),
      headingsStructure: Math.round((getAuditScore('document-title') || 0.7) * 100),
      metaTags: Math.round((getAuditScore('meta-description') || 0.5) * 100),
      // Core Web Vitals
      lcp: lcp,
      fid: fid,
      cls: cls,
      // Mobile usability details
      tapTargetsScore: tapTargetsScore * 100,
      tapTargetsIssues: tapTargetsDetails.length,
      recommendations: auditItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        importance: item.importance
      }))
    };
    
    // Salvar no cache
    resultsCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error processing Page Insights data:', error);
    // Gerar dados locais em caso de erro de processamento
    return generateLocalPageInsights(url);
  }
}

// Memoized lookup table para importância de auditorias
const auditImportanceLookup: Record<string, number> = {
  'is-on-https': 3,
  'viewport': 3,
  'document-title': 3,
  'meta-description': 3,
  'link-text': 3,
  'crawlable-anchors': 3,
  'largest-contentful-paint': 3,
  'cumulative-layout-shift': 3,
  'total-blocking-time': 3,
  'uses-optimized-images': 2,
  'tap-targets': 2,
  'structured-data': 2,
  'hreflang': 2,
  'plugins': 2,
  'first-contentful-paint': 2,
  'interactive': 2
};

/**
 * Determine a importância de cada auditoria - otimizado com lookup table
 * @param auditId O ID da auditoria do Google Page Insights
 * @returns Nível de importância (1-3)
 */
export function getAuditImportance(auditId: string): number {
  return auditImportanceLookup[auditId] || 1;
}

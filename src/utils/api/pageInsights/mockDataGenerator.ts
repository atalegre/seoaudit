
import { PageInsightsData } from './types';

/**
 * Generate mock data for PageSpeed Insights
 * @param url URL to analyze
 * @returns Mock PageInsights data
 */
export function generateMockData(url: string): PageInsightsData {
  // Create a random score between 50 and 95
  const randomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    url: url,
    score: randomScore(50, 95),
    performanceScore: randomScore(60, 95),
    bestPracticesScore: randomScore(70, 100),
    loadTimeDesktop: randomScore(1, 5) + Math.random(),
    loadTimeMobile: randomScore(2, 7) + Math.random(),
    mobileFriendly: Math.random() > 0.2,
    security: Math.random() > 0.1,
    imageOptimization: randomScore(40, 100),
    headingsStructure: randomScore(50, 100),
    metaTags: randomScore(40, 100),
    lcp: randomScore(15, 45) / 10,
    cls: randomScore(1, 50) / 100,
    fid: randomScore(50, 300),
    tapTargetsScore: randomScore(50, 100),
    tapTargetsIssues: randomScore(0, 5)
  };
}

/**
 * Generate local page insights with error indication
 * @param url URL to analyze
 * @returns Formatted error object
 */
export function generateLocalPageInsights(url: string): PageInsightsData {
  console.error('Tentativa de obter dados SEO sem API configurada para:', url);
  
  // Return a formatted object with all required properties
  return {
    url: url,
    score: 0,
    performanceScore: 0,
    bestPracticesScore: 0,
    loadTimeDesktop: 0,
    loadTimeMobile: 0,
    mobileFriendly: false,
    security: false,
    imageOptimization: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    errorMessage: 'Dados SEO não disponíveis. Configure uma chave API válida do Google Page Insights nas Configurações.',
    isError: true
  };
}


import { PageInsightsData } from './types';

/**
 * Esta função retorna um objeto de erro formatado em vez de lançar uma exceção,
 * permitindo que a análise continue com dados parciais
 * @param url URL to analyze
 * @returns Formatted error object
 */
export function generateLocalPageInsights(url: string): PageInsightsData {
  console.error('Tentativa de obter dados SEO sem API configurada para:', url);
  
  // Retornar um objeto formatado com todas as propriedades necessárias
  // mas com valores que indicam claramente que são dados de erro
  return {
    url: url,
    score: 0,
    performanceScore: 0,
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

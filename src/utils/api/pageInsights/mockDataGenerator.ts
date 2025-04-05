
import { PageInsightsData } from './types';

/**
 * Esta função anteriormente gerava dados simulados, mas agora apenas lança um erro
 * para evitar a apresentação de dados não reais
 * @param url URL to analyze
 * @throws Error indicando que não foi possível obter dados reais
 */
export function generateLocalPageInsights(url: string): PageInsightsData {
  console.error('Tentativa de gerar dados simulados para:', url);
  throw new Error('Dados SEO não disponíveis. Por favor, configure uma chave API válida.');
}

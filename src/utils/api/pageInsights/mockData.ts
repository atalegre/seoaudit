
import { PageInsightsData } from './types';

/**
 * Gera dados simulados para PageSpeed Insights
 * @param url URL analisada
 * @returns Dados simulados
 */
export function generateMockPageInsightsData(url: string): PageInsightsData {
  const performanceScore = Math.floor(Math.random() * 51) + 50; // 50-100
  const fcp = (Math.random() * 2 + 1).toFixed(1); // 1.0-3.0
  const lcp = (Math.random() * 2 + 2).toFixed(1); // 2.0-4.0
  const cls = (Math.random() * 0.2).toFixed(2); // 0.00-0.20
  const fid = Math.floor(Math.random() * 100) + 50; // 50-150ms
  
  return {
    performanceScore,
    fcp: parseFloat(fcp),
    lcp: parseFloat(lcp),
    tbt: Math.floor(Math.random() * 300) + 100, // 100-400
    cls: parseFloat(cls),
    speedIndex: (Math.random() * 3 + 2).toFixed(1), // 2.0-5.0
    tti: (Math.random() * 3 + 3).toFixed(1), // 3.0-6.0
    fid,
    mobileFriendly: Math.random() > 0.2, // 80% chance of being mobile friendly
    security: {
      https: Math.random() > 0.1, // 90% chance of having HTTPS
      mixedContent: Math.random() < 0.1 // 10% chance of mixed content
    },
    headingsStructure: {
      hasH1: true,
      multipleH1: Math.random() < 0.3, // 30% chance of multiple H1
      headingsOrder: Math.random() > 0.2 // 80% chance of proper order
    },
    metaTags: {
      title: url.includes('pai.pt') ? 'PAI - Portal da Administração Interna' : 'Example Website',
      description: 'Este é um exemplo de meta descrição gerada para fins de demonstração da ferramenta de análise SEO.',
      titleLength: 30,
      descriptionLength: 90
    },
    recommendations: [
      {
        id: 'render-blocking-resources',
        title: 'Eliminar recursos que bloqueiam a renderização',
        description: 'O tempo de carregamento da página poderia ser mais rápido se estes recursos não bloqueassem a renderização.',
        impact: 'high',
        category: 'performance'
      },
      {
        id: 'uses-responsive-images',
        title: 'Dimensionar corretamente as imagens',
        description: 'Servir imagens com o tamanho apropriado para economizar dados móveis e melhorar o tempo de carregamento.',
        impact: 'medium',
        category: 'performance'
      },
      {
        id: 'uses-optimized-images',
        title: 'Otimizar imagens',
        description: 'Imagens otimizadas carregam mais rápido e consomem menos dados móveis.',
        impact: 'medium',
        category: 'performance'
      }
    ]
  };
}

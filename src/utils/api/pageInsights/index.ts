
import type { PageInsightsData } from './types';

// This is a mock implementation - in a real app, you would call the Google PageSpeed Insights API
export const getPageInsightsData = async (url: string): Promise<PageInsightsData> => {
  console.log(`Analyzing URL: ${url}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data for demo purposes
  return {
    performanceScore: Math.floor(Math.random() * 41) + 60, // 60-100
    fcp: Math.random() * 2 + 0.8, // 0.8-2.8s
    lcp: Math.random() * 3 + 1.5, // 1.5-4.5s
    tbt: Math.random() * 500, // 0-500ms
    cls: Math.random() * 0.25, // 0-0.25
    speedIndex: Math.random() * 4 + 2, // 2-6s
    tti: Math.random() * 5 + 3, // 3-8s
    fid: Math.floor(Math.random() * 200) + 50, // 50-250ms
    mobileFriendly: Math.random() > 0.2, // 80% chance of being mobile friendly
    security: {
      https: Math.random() > 0.1, // 90% chance of having HTTPS
      mixedContent: Math.random() < 0.2, // 20% chance of having mixed content
    },
    headingsStructure: {
      hasH1: Math.random() > 0.1, // 90% chance of having an H1
      multipleH1: Math.random() < 0.3, // 30% chance of having multiple H1s
      headingsOrder: Math.random() > 0.2, // 80% chance of having proper heading order
    },
    metaTags: {
      title: "Example Page Title - Brand | Keywords",
      description: "This is an example meta description that provides a brief summary of the page content optimized for search engines and users.",
      titleLength: 45,
      descriptionLength: 130,
    },
    recommendations: [
      {
        id: "render-blocking-resources",
        title: "Eliminar recursos que bloqueiam a renderização",
        description: "Recursos como CSS e JavaScript podem atrasar a primeira renderização da sua página. Considere entregar CSS crítico inline e adiar JavaScript não crítico.",
        impact: "high",
        category: "performance",
      },
      {
        id: "properly-size-images",
        title: "Dimensionar imagens corretamente",
        description: "Servir imagens com o tamanho correto economiza dados móveis e melhora o tempo de carregamento.",
        impact: "medium",
        category: "performance",
      },
      {
        id: "defer-offscreen-images",
        title: "Adiar carregamento de imagens fora da tela",
        description: "Considere usar lazy loading para imagens que não estão visíveis na primeira visualização.",
        impact: "medium",
        category: "performance",
      },
      {
        id: "meta-description",
        title: "Melhorar meta descrição",
        description: "A meta descrição tem menos de 120 caracteres. Considere expandir para 150-160 caracteres para maior visibilidade nos resultados de busca.",
        impact: "low",
        category: "seo",
      },
    ],
  };
};

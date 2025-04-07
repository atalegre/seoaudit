
import { PageInsightsData } from './types';

/**
 * Generate local page insights with simulated data
 * @param url URL to analyze
 * @returns Formatted PageInsights data
 */
export function generateLocalPageInsights(url: string): PageInsightsData {
  console.log('Using local page insights for:', url);
  
  // Create random scores between 50 and 95
  const randomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Random boolean with weighting
  const randomBool = (trueWeight = 0.8) => Math.random() < trueWeight;
  
  // Example meta data
  const metaTitle = "Example Page Title - Brand | Keywords";
  const metaDescription = "This is an example meta description that provides a brief summary of the page content optimized for search engines and users.";
  
  // Create random recommendations
  const recommendationCategories = ['performance', 'seo', 'best-practices', 'accessibility'];
  const impacts: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  
  const recommendations = [
    {
      id: "render-blocking-resources",
      title: "Eliminar recursos que bloqueiam a renderização",
      description: "Recursos como CSS e JavaScript podem atrasar a primeira renderização da sua página. Considere entregar CSS crítico inline e adiar JavaScript não crítico.",
      impact: impacts[0],
      category: recommendationCategories[0],
    },
    {
      id: "properly-size-images",
      title: "Dimensionar imagens corretamente",
      description: "Servir imagens com o tamanho correto economiza dados móveis e melhora o tempo de carregamento.",
      impact: impacts[1],
      category: recommendationCategories[0],
    },
    {
      id: "defer-offscreen-images",
      title: "Adiar carregamento de imagens fora da tela",
      description: "Considere usar lazy loading para imagens que não estão visíveis na primeira visualização.",
      impact: impacts[1],
      category: recommendationCategories[0],
    },
    {
      id: "meta-description",
      title: "Melhorar meta descrição",
      description: "A meta descrição tem menos de 120 caracteres. Considere expandir para 150-160 caracteres para maior visibilidade nos resultados de busca.",
      impact: impacts[2],
      category: recommendationCategories[1],
    }
  ];
  
  return {
    performanceScore: randomScore(60, 95),
    fcp: Math.random() * 2 + 0.8, // 0.8-2.8s
    lcp: Math.random() * 3 + 1.5, // 1.5-4.5s
    tbt: Math.random() * 500, // 0-500ms
    cls: Math.random() * 0.25, // 0-0.25
    speedIndex: Math.random() * 4 + 2, // 2-6s
    tti: Math.random() * 5 + 3, // 3-8s
    fid: Math.floor(Math.random() * 200) + 50, // 50-250ms
    mobileFriendly: randomBool(0.8), // 80% chance of being mobile friendly
    security: {
      https: randomBool(0.9), // 90% chance of having HTTPS
      mixedContent: randomBool(0.2), // 20% chance of having mixed content
    },
    headingsStructure: {
      hasH1: randomBool(0.9), // 90% chance of having an H1
      multipleH1: randomBool(0.3), // 30% chance of having multiple H1s
      headingsOrder: randomBool(0.8), // 80% chance of having proper heading order
    },
    metaTags: {
      title: metaTitle,
      description: metaDescription,
      titleLength: metaTitle.length,
      descriptionLength: metaDescription.length,
    },
    recommendations: recommendations,
  };
}

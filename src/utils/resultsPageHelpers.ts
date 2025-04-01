
import { AnalysisResult } from './analyzerUtils';

// Helper function to determine status based on scores
export function determineStatus(seoScore: number, aioScore: number): 'Saudável' | 'A melhorar' | 'Crítico' {
  const averageScore = (seoScore + aioScore) / 2;
  
  if (averageScore >= 80) return 'Saudável';
  if (averageScore >= 60) return 'A melhorar';
  return 'Crítico';
}

// Helper function to format URL for display
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

// Helper function to generate recommendations
export function generateRecommendations(seo: any, aio: any) {
  const recommendations = [];

  // SEO recommendations
  if (seo.loadTimeDesktop > 3) {
    recommendations.push({
      suggestion: 'Otimize o tempo de carregamento da página para desktop',
      seoImpact: 'Alto',
      aioImpact: 'Nenhum',
      priority: 9,
    });
  }

  if (seo.loadTimeMobile > 5) {
    recommendations.push({
      suggestion: 'Otimize o tempo de carregamento da página para mobile',
      seoImpact: 'Alto',
      aioImpact: 'Nenhum',
      priority: 9,
    });
  }

  if (!seo.mobileFriendly) {
    recommendations.push({
      suggestion: 'Torne o site mobile-friendly',
      seoImpact: 'Alto',
      aioImpact: 'Médio',
      priority: 8,
    });
  }

  if (!seo.security) {
    recommendations.push({
      suggestion: 'Implemente HTTPS no seu site',
      seoImpact: 'Alto',
      aioImpact: 'Nenhum',
      priority: 10,
    });
  }

  if (seo.imageOptimization < 60) {
    recommendations.push({
      suggestion: 'Otimize as imagens do site',
      seoImpact: 'Médio',
      aioImpact: 'Baixo',
      priority: 6,
    });
  }

  if (seo.headingsStructure < 60) {
    recommendations.push({
      suggestion: 'Melhore a estrutura de headings do site',
      seoImpact: 'Médio',
      aioImpact: 'Alto',
      priority: 7,
    });
  }

  if (seo.metaTags < 60) {
    recommendations.push({
      suggestion: 'Otimize as meta tags do site',
      seoImpact: 'Médio',
      aioImpact: 'Baixo',
      priority: 5,
    });
  }

  // AIO recommendations
  if (aio.contentClarity < 60) {
    recommendations.push({
      suggestion: 'Melhore a clareza do conteúdo do site',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 7,
    });
  }

  if (aio.logicalStructure < 60) {
    recommendations.push({
      suggestion: 'Melhore a estrutura lógica do site',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 6,
    });
  }

  if (aio.naturalLanguage < 60) {
    recommendations.push({
      suggestion: 'Melhore a linguagem natural do site',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 5,
    });
  }
  
  return recommendations;
}

// Create analysis result with proper types
export function createAnalysisResult(
  url: string, 
  seoData: any, 
  aioData: any
): AnalysisResult {
  const status = determineStatus(seoData.score, aioData.score);
  
  return {
    url,
    timestamp: new Date().toISOString(),
    status,
    seo: seoData,
    aio: aioData,
    recommendations: generateRecommendations(seoData, aioData),
    overallStatus: status
  };
}

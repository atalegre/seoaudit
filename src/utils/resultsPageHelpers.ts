
import { AnalysisResult } from './analyzerUtils';

// Determine status based on scores using a more efficient approach
export function determineStatus(seoScore: number, aioScore: number): 'Saudável' | 'A melhorar' | 'Crítico' {
  const averageScore = (seoScore + aioScore) / 2;
  return averageScore >= 80 ? 'Saudável' : averageScore >= 60 ? 'A melhorar' : 'Crítico';
}

// Format URL for display - simplified
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

// Generate recommendations with improved efficiency
export function generateRecommendations(seo: any, aio: any) {
  const recommendations = [];

  // Use threshold-based checks for better performance
  const checks = [
    {
      condition: seo?.loadTimeDesktop > 3,
      recommendation: {
        suggestion: 'Otimize o tempo de carregamento da página para desktop',
        seoImpact: 'Alto',
        aioImpact: 'Nenhum',
        priority: 9,
        status: 'pending'
      }
    },
    {
      condition: seo?.loadTimeMobile > 5,
      recommendation: {
        suggestion: 'Otimize o tempo de carregamento da página para mobile',
        seoImpact: 'Alto',
        aioImpact: 'Nenhum',
        priority: 9,
        status: 'pending'
      }
    },
    {
      condition: seo?.mobileFriendly === false,
      recommendation: {
        suggestion: 'Torne o site mobile-friendly',
        seoImpact: 'Alto',
        aioImpact: 'Médio',
        priority: 8,
        status: 'pending'
      }
    },
    {
      condition: seo?.security === false,
      recommendation: {
        suggestion: 'Implemente HTTPS no seu site',
        seoImpact: 'Alto',
        aioImpact: 'Nenhum',
        priority: 10,
        status: 'pending'
      }
    },
    {
      condition: seo?.imageOptimization < 60,
      recommendation: {
        suggestion: 'Otimize as imagens do site',
        seoImpact: 'Médio',
        aioImpact: 'Baixo',
        priority: 6,
        status: 'pending'
      }
    },
    {
      condition: seo?.headingsStructure < 60,
      recommendation: {
        suggestion: 'Melhore a estrutura de headings do site',
        seoImpact: 'Médio',
        aioImpact: 'Alto',
        priority: 7,
        status: 'pending'
      }
    },
    {
      condition: seo?.metaTags < 60,
      recommendation: {
        suggestion: 'Otimize as meta tags do site',
        seoImpact: 'Médio',
        aioImpact: 'Baixo',
        priority: 5,
        status: 'pending'
      }
    },
    {
      condition: aio?.contentClarity < 60,
      recommendation: {
        suggestion: 'Melhore a clareza do conteúdo do site',
        seoImpact: 'Baixo',
        aioImpact: 'Alto',
        priority: 7,
        status: 'pending'
      }
    },
    {
      condition: aio?.logicalStructure < 60,
      recommendation: {
        suggestion: 'Melhore a estrutura lógica do site',
        seoImpact: 'Baixo',
        aioImpact: 'Alto',
        priority: 6,
        status: 'pending'
      }
    },
    {
      condition: aio?.naturalLanguage < 60,
      recommendation: {
        suggestion: 'Melhore a linguagem natural do site',
        seoImpact: 'Baixo',
        aioImpact: 'Alto',
        priority: 5,
        status: 'pending'
      }
    }
  ];

  // Add recommendations based on conditions, safely handle possible null values
  if (seo && aio) {
    checks.forEach(check => {
      if (check.condition) {
        recommendations.push(check.recommendation);
      }
    });
  }
  
  return recommendations;
}

// Create analysis result with proper types - made more concise
export function createAnalysisResult(
  url: string, 
  seoData: any, 
  aioData: any
): AnalysisResult {
  // Create default data for null inputs
  const defaultSeoData = {
    score: 60,
    performanceScore: 65,
    bestPracticesScore: 70,
    loadTimeDesktop: 3.2,
    loadTimeMobile: 5.1,
    mobileFriendly: false,
    security: true,
    imageOptimization: 60,
    headingsStructure: 65,
    metaTags: 60,
    lcp: 3.5,
    fid: 120,
    cls: 0.15,
    recommendations: []
  };

  const defaultAioData = {
    score: 65,
    contentClarity: 70,
    logicalStructure: 65,
    naturalLanguage: 60,
    topicsDetected: ["Tecnologia", "Serviços"],
    confusingParts: []
  };
  
  // Use provided data or defaults
  const seo = seoData || defaultSeoData;
  const aio = aioData || defaultAioData;
  
  const status = determineStatus(seo.score, aio.score);
  
  return {
    url,
    timestamp: new Date().toISOString(),
    status,
    seo: seo,
    aio: aio,
    recommendations: generateRecommendations(seo, aio),
    overallStatus: status
  };
}

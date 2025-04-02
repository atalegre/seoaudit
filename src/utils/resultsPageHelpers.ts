import { AnalysisResult, SeoAnalysisResult, AioAnalysisResult, Recommendation, StatusClassification } from './api/types';

// Determine status based on scores using a more efficient approach
export function determineStatus(seoScore: number, aioScore: number): StatusClassification {
  const averageScore = (seoScore + aioScore) / 2;
  return averageScore >= 80 ? 'Saudável' : averageScore >= 60 ? 'A melhorar' : 'Crítico';
}

// Format URL for display - simplified
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

// Generate recommendations with improved efficiency and null safety
export function generateRecommendations(seo: any, aio: any): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Skip if both seo and aio are null
  if (!seo && !aio) {
    return [];
  }

  // Use threshold-based checks for better performance
  // Adding null safety throughout
  const checks = [
    {
      condition: seo && seo.loadTimeDesktop > 3,
      recommendation: {
        suggestion: 'Otimize o tempo de carregamento da página para desktop',
        seoImpact: 'Alto' as const,
        aioImpact: 'Nenhum' as const,
        priority: 9,
        status: 'pending' as const
      }
    },
    {
      condition: seo && seo.loadTimeMobile > 5,
      recommendation: {
        suggestion: 'Otimize o tempo de carregamento da página para mobile',
        seoImpact: 'Alto' as const,
        aioImpact: 'Nenhum' as const,
        priority: 9,
        status: 'pending' as const
      }
    },
    {
      condition: seo && seo.mobileFriendly === false,
      recommendation: {
        suggestion: 'Torne o site mobile-friendly',
        seoImpact: 'Alto' as const,
        aioImpact: 'Médio' as const,
        priority: 8,
        status: 'pending' as const
      }
    },
    {
      condition: seo && seo.security === false,
      recommendation: {
        suggestion: 'Implemente HTTPS no seu site',
        seoImpact: 'Alto' as const,
        aioImpact: 'Nenhum' as const,
        priority: 10,
        status: 'pending' as const
      }
    },
    {
      condition: seo && seo.imageOptimization < 60,
      recommendation: {
        suggestion: 'Otimize as imagens do site',
        seoImpact: 'Médio' as const,
        aioImpact: 'Baixo' as const,
        priority: 6,
        status: 'pending' as const
      }
    },
    {
      condition: seo && seo.headingsStructure < 60,
      recommendation: {
        suggestion: 'Melhore a estrutura de headings do site',
        seoImpact: 'Médio' as const,
        aioImpact: 'Alto' as const,
        priority: 7,
        status: 'pending' as const
      }
    },
    {
      condition: seo && seo.metaTags < 60,
      recommendation: {
        suggestion: 'Otimize as meta tags do site',
        seoImpact: 'Médio' as const,
        aioImpact: 'Baixo' as const,
        priority: 5,
        status: 'pending' as const
      }
    },
    {
      condition: aio && aio.contentClarity < 60,
      recommendation: {
        suggestion: 'Melhore a clareza do conteúdo do site',
        seoImpact: 'Baixo' as const,
        aioImpact: 'Alto' as const,
        priority: 7,
        status: 'pending' as const
      }
    },
    {
      condition: aio && aio.logicalStructure < 60,
      recommendation: {
        suggestion: 'Melhore a estrutura lógica do site',
        seoImpact: 'Baixo' as const,
        aioImpact: 'Alto' as const,
        priority: 6,
        status: 'pending' as const
      }
    },
    {
      condition: aio && aio.naturalLanguage < 60,
      recommendation: {
        suggestion: 'Melhore a linguagem natural do site',
        seoImpact: 'Baixo' as const,
        aioImpact: 'Alto' as const,
        priority: 5,
        status: 'pending' as const
      }
    }
  ];

  // Add recommendations based on conditions, safely handle possible null values
  checks.forEach(check => {
    if (check.condition) {
      recommendations.push(check.recommendation);
    }
  });
  
  return recommendations;
}

// Create analysis result with proper types and null safety
export function createAnalysisResult(
  url: string, 
  seoData: any | null, 
  aioData: any | null
): AnalysisResult {
  // Create default data for null inputs
  const defaultSeoData: SeoAnalysisResult = {
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
    companyName: extractCompanyName(url) // Extract company name from URL
  };

  const defaultAioData: AioAnalysisResult = {
    score: 65,
    contentClarity: 70,
    logicalStructure: 65,
    naturalLanguage: 60,
    topicsDetected: ["Tecnologia", "Serviços"],
    confusingParts: []
  };
  
  // Use provided data or defaults
  const seo = seoData || defaultSeoData;
  
  // Ensure company name is set
  if (seoData && !seoData.companyName) {
    seoData.companyName = extractCompanyName(url);
  }
  
  const aio = aioData || defaultAioData;
  
  const status = determineStatus(seo.score, aio.score);
  
  return {
    url,
    timestamp: new Date().toISOString(),
    status,
    seo,
    aio,
    recommendations: generateRecommendations(seo, aio),
    overallStatus: status,
    logoUrl: null
  };
}

// Helper function to extract company name from URL
function extractCompanyName(url: string): string {
  try {
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    const parts = domain.split('.');
    
    if (parts.length >= 2) {
      // Remove common TLDs and www
      const name = parts[0] === 'www' ? parts[1] : parts[0];
      
      // Format the company name (capitalize first letter)
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    return domain;
  } catch (error) {
    console.error('Error extracting company name:', error);
    return '';
  }
}

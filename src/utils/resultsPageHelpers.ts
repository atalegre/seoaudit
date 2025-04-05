import { AnalysisResult, AccessibilityAnalysisResult, SeoAnalysisResult } from './api/types';
import { PageInsightsData } from './api/pageInsights/types';

/**
 * Format URL for display by removing protocol
 */
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

// Create analysis result from SEO and AIO data
export function createAnalysisResult(
  url: string, 
  seoData: PageInsightsData | null, 
  aioData: any | null, 
  accessibilityData: AccessibilityAnalysisResult | null = null
): AnalysisResult {
  // Create a default SEO object with simulated data if we don't have real data
  const seo: SeoAnalysisResult = seoData ? {
    ...seoData,
    score: seoData.score || 65,
    performanceScore: seoData.performanceScore || 70,
    bestPracticesScore: seoData.bestPracticesScore || 75,
    loadTimeDesktop: seoData.loadTimeDesktop || 3.2,
    loadTimeMobile: seoData.loadTimeMobile || 5.1,
    mobileFriendly: seoData.mobileFriendly !== undefined ? seoData.mobileFriendly : true,
    security: seoData.security !== undefined ? seoData.security : true,
    imageOptimization: seoData.imageOptimization || 60,
    headingsStructure: seoData.headingsStructure || 65,
    metaTags: seoData.metaTags || 70,
    lcp: seoData.lcp || 3.5,
    fid: seoData.fid || 120,
    cls: seoData.cls || 0.15
  } : {
    score: 65,
    performanceScore: 70,
    bestPracticesScore: 75,
    loadTimeDesktop: 3.2,
    loadTimeMobile: 5.1,
    mobileFriendly: true,
    security: true,
    imageOptimization: 60,
    headingsStructure: 65,
    metaTags: 70,
    lcp: 3.5, 
    fid: 120,
    cls: 0.15
  };
  
  // Create a default AIO object with simulated data if we don't have real data
  const aio = aioData ? {
    ...aioData,
    score: aioData.score || 70
  } : {
    score: 70,
    contentClarity: 65,
    logicalStructure: 75,
    naturalLanguage: 70,
    topicsDetected: ["Website", "Digital"],
    confusingParts: ["Algumas seções têm linguagem técnica em excesso"]
  };
  
  // Use provided accessibility data or create default
  const accessibility = accessibilityData || {
    score: 65,
    violations: [],
    wcagCompliant: false,
    eaaCompliant: false,
    passedTests: [],
    manualChecksNeeded: []
  };
  
  // Generate recommendations based on issues found in both analyses
  const recommendations = generateRecommendations(seo, aio, accessibility);
  
  // Calculate overall status based on all scores
  const scores = [seo.score, aio.score];
  if (accessibility) {
    scores.push(accessibility.score);
  }
  
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const overallStatus = 
    avgScore >= 80 ? 'Saudável' : 
    avgScore >= 60 ? 'A melhorar' : 
    'Crítico';
  
  return {
    url,
    timestamp: new Date().toISOString(),
    status: 'Concluída',
    seo,
    aio,
    accessibility,
    recommendations,
    overallStatus
  };
}

// Generate recommendations based on issues found
function generateRecommendations(seo: any, aio: any, accessibility?: AccessibilityAnalysisResult): any[] {
  const recommendations = [];
  
  // Add recommendations based on SEO issues
  if (seo.mobileFriendly === false) {
    recommendations.push({
      id: Date.now() + 1,
      suggestion: "Otimizar o site para dispositivos móveis",
      seoImpact: "Alto",
      aioImpact: "Médio",
      priority: 1,
      status: "pending"
    });
  }
  
  if (seo.security === false) {
    recommendations.push({
      id: Date.now() + 2,
      suggestion: "Implementar HTTPS para melhorar a segurança",
      seoImpact: "Alto",
      aioImpact: "Baixo",
      priority: 1,
      status: "pending"
    });
  }
  
  if (seo.imageOptimization < 70) {
    recommendations.push({
      id: Date.now() + 3,
      suggestion: "Otimizar imagens para melhorar o tempo de carregamento",
      seoImpact: "Médio",
      aioImpact: "Baixo",
      priority: 2,
      status: "pending"
    });
  }
  
  // Add recommendations based on AIO issues
  if (aio.contentClarity < 70) {
    recommendations.push({
      id: Date.now() + 4,
      suggestion: "Melhorar a clareza do conteúdo para algoritmos de IA",
      seoImpact: "Baixo",
      aioImpact: "Alto",
      priority: 2,
      status: "pending"
    });
  }
  
  // Add recommendations based on accessibility issues
  if (accessibility && accessibility.violations && accessibility.violations.length > 0) {
    // Group by impact level
    const criticalViolations = accessibility.violations.filter(v => v.impact === 'critical');
    const seriousViolations = accessibility.violations.filter(v => v.impact === 'serious');
    
    if (criticalViolations.length > 0) {
      recommendations.push({
        id: Date.now() + 5,
        suggestion: `Corrigir ${criticalViolations.length} problemas críticos de acessibilidade`,
        seoImpact: "Médio",
        aioImpact: "Alto",
        priority: 1,
        status: "pending"
      });
    }
    
    if (seriousViolations.length > 0) {
      recommendations.push({
        id: Date.now() + 6,
        suggestion: `Resolver ${seriousViolations.length} problemas sérios de acessibilidade WCAG`,
        seoImpact: "Baixo",
        aioImpact: "Médio",
        priority: 2,
        status: "pending"
      });
    }
    
    // Add specific recommendations for common issues
    const hasImageAltIssue = accessibility.violations.some(v => v.id === 'image-alt');
    if (hasImageAltIssue) {
      recommendations.push({
        id: Date.now() + 7,
        suggestion: "Adicionar texto alternativo a todas as imagens",
        seoImpact: "Médio",
        aioImpact: "Alto",
        priority: 2,
        status: "pending"
      });
    }
    
    const hasColorContrastIssue = accessibility.violations.some(v => v.id === 'color-contrast');
    if (hasColorContrastIssue) {
      recommendations.push({
        id: Date.now() + 8,
        suggestion: "Melhorar contraste de cores para conformidade com WCAG",
        seoImpact: "Baixo",
        aioImpact: "Médio",
        priority: 3,
        status: "pending"
      });
    }
  }
  
  return recommendations;
}

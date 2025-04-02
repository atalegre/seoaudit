import { PageInsightsData } from './types';

/**
 * Generate local page insights data when external API is unavailable
 * @param url URL to analyze
 * @returns Mock page insights data
 */
export function generateLocalPageInsights(url: string): PageInsightsData {
  console.log('Generating local Page Insights data for URL:', url);
  
  // Generate hash based on URL for consistent results
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  
  // Generate scores based on hash, but within realistic ranges
  const seoScore = Math.abs(hash % 30) + 60; // 60-90
  const performanceScore = Math.abs((hash >> 3) % 40) + 50; // 50-90
  const bestPracticesScore = Math.abs((hash >> 6) % 25) + 65; // 65-90
  
  // Values for Core Web Vitals 
  const lcp = (Math.abs((hash >> 8) % 30) + 15) / 10; // 1.5-4.5s
  const fid = Math.abs((hash >> 10) % 80) + 70; // 70-150ms
  const cls = (Math.abs((hash >> 12) % 15) + 5) / 100; // 0.05-0.20
  
  // Other metrics
  const loadTimeDesktop = (Math.abs((hash >> 14) % 25) + 15) / 10; // 1.5-4.0s
  const loadTimeMobile = (Math.abs((hash >> 16) % 35) + 25) / 10; // 2.5-6.0s
  const mobileFriendly = (hash % 4 > 0); // 75% chance of being mobile-friendly
  const security = (hash % 3 > 0); // 66% chance of having HTTPS
  
  // Generate recommendations based on hash
  const possibleRecommendations = [
    {
      id: "uses-responsive-images",
      title: "Utilize imagens responsivas",
      description: "Sirva imagens com tamanhos apropriados para economizar dados e melhorar o tempo de carregamento", 
      importance: 3
    },
    {
      id: "properly-size-images", 
      title: "Dimensione imagens corretamente",
      description: "Sirva imagens com o tamanho apropriado para economizar dados e melhorar o tempo de carregamento", 
      importance: 3
    },
    {
      id: "offscreen-images", 
      title: "Carregue imagens fora da tela sob demanda",
      description: "Considere usar lazy-loading para imagens que estão fora da viewport inicial", 
      importance: 2
    },
    {
      id: "render-blocking-resources", 
      title: "Elimine recursos que bloqueiam a renderização",
      description: "Recursos que bloqueiam a primeira renderização da página deve ser carregados de forma assíncrona", 
      importance: 3
    },
    {
      id: "unminified-css", 
      title: "Minifique CSS",
      description: "A minificação do CSS pode reduzir o tamanho da rede e melhorar o tempo de carregamento", 
      importance: 2
    },
    {
      id: "unminified-javascript", 
      title: "Minifique JavaScript",
      description: "A minificação do JavaScript pode reduzir o tamanho da rede e melhorar o tempo de carregamento", 
      importance: 2
    },
    {
      id: "unused-javascript", 
      title: "Remova JavaScript não utilizado",
      description: "Remova código JavaScript que não está sendo utilizado para reduzir o tempo de carregamento", 
      importance: 2
    },
    {
      id: "unused-css-rules", 
      title: "Remova CSS não utilizado",
      description: "Remova regras CSS não utilizadas para reduzir o tamanho dos arquivos e melhorar o tempo de carregamento", 
      importance: 2
    },
    {
      id: "uses-webp-images", 
      title: "Utilize formatos de imagem modernos",
      description: "Use formatos de imagem como WebP que oferecem melhor compressão que PNG ou JPEG", 
      importance: 2
    },
    {
      id: "uses-text-compression", 
      title: "Habilite compressão de texto",
      description: "Compacte recursos baseados em texto para reduzir o tamanho da rede", 
      importance: 3
    }
  ];
  
  // Select 4-6 recommendations based on hash
  const numRecommendations = 4 + (hash % 3); // 4-6
  const recommendations = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < numRecommendations; i++) {
    const index = Math.abs((hash >> (i * 3)) % possibleRecommendations.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      recommendations.push(possibleRecommendations[index]);
    }
  }
  
  // Build result
  return {
    score: seoScore,
    performanceScore: performanceScore,
    bestPracticesScore: bestPracticesScore,
    url: url,
    loadTimeDesktop: loadTimeDesktop,
    loadTimeMobile: loadTimeMobile,
    mobileFriendly: mobileFriendly,
    security: security,
    imageOptimization: Math.abs((hash >> 18) % 30) + 55, // 55-85
    headingsStructure: Math.abs((hash >> 20) % 25) + 60, // 60-85
    metaTags: Math.abs((hash >> 22) % 30) + 50, // 50-80
    // Core Web Vitals
    lcp: lcp,
    fid: fid,
    cls: cls,
    // Mobile usability details
    tapTargetsScore: Math.abs((hash >> 24) % 50) + 50, // 50-100
    tapTargetsIssues: hash % 5, // 0-4 issues
    recommendations: recommendations,
    generated: true
  };
}

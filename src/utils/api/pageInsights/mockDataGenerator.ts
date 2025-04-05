
import { PageInsightsData } from './types';

/**
 * Generate local page insights with simulated data
 * @param url URL to analyze
 * @returns Formatted PageInsights data
 */
export function generateLocalPageInsights(url: string): PageInsightsData {
  console.log('Using local page insights for:', url);
  
  // Create a random score between 50 and 95
  const randomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    url: url,
    score: randomScore(50, 95),
    performanceScore: randomScore(60, 95),
    bestPracticesScore: randomScore(70, 100),
    loadTimeDesktop: randomScore(1, 5) + Math.random(),
    loadTimeMobile: randomScore(2, 7) + Math.random(),
    mobileFriendly: Math.random() > 0.2,
    security: Math.random() > 0.1,
    imageOptimization: randomScore(40, 100),
    headingsStructure: randomScore(50, 100),
    metaTags: randomScore(40, 100),
    lcp: randomScore(15, 45) / 10,
    cls: randomScore(1, 50) / 100,
    fid: randomScore(50, 300),
    tapTargetsScore: randomScore(50, 100),
    tapTargetsIssues: randomScore(0, 5)
  };
}

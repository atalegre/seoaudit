
import { useEffect } from 'react';
import { useUrlState } from './dashboard/useUrlState';
import { useScoreData } from './dashboard/useScoreData';
import { useRecommendations, SampleRecommendation } from './dashboard/useRecommendations';
import { useLogoFetcher } from './dashboard/useLogoFetcher';
import { useAnalysisState } from './dashboard/useAnalysisState';
import { toast } from 'sonner';

export type { SampleRecommendation } from './dashboard/useRecommendations';

/**
 * Main hook that combines all dashboard functionality
 */
export const useDashboardState = () => {
  // Get URL and domain state
  const {
    url,
    domain,
    lastAnalysisDate,
    analyzeDomain,
    setAnalyzeDomain
  } = useUrlState();

  // Get score-related functionality
  const {
    totalScore,
    seoScore,
    aioScore,
    llmScore,
    performanceScore,
    directoryScore,
    keywordScore,
    calculateScores
  } = useScoreData(domain);

  // Get recommendations functionality
  const { recommendations, generateRecommendations } = useRecommendations();

  // Get logo fetching functionality
  const { logoUrl, fetchLogo } = useLogoFetcher();

  // Get analysis state management
  const { isLoading, runAnalysis } = useAnalysisState();

  // Initialize data when URL changes
  useEffect(() => {
    if (url) {
      // Fetch logo for the website
      fetchLogo(url);
      
      // Calculate scores based on domain
      calculateScores(domain);
      
      // Generate recommendations based on scores
      setTimeout(() => {
        generateRecommendations(seoScore, aioScore, performanceScore);
      }, 100);
    }
  }, [url, domain]);

  /**
   * Handler to re-run analysis
   */
  const handleRerunAnalysis = () => {
    runAnalysis(url, () => {
      // Recalculate scores
      calculateScores(domain);
      
      // Regenerate recommendations
      generateRecommendations(seoScore, aioScore, performanceScore);
    });
  };

  return {
    url,
    domain,
    lastAnalysisDate,
    isLoading,
    logoUrl,
    totalScore,
    seoScore,
    aioScore,
    llmScore,
    performanceScore,
    directoryScore,
    keywordScore,
    recommendations,
    analyzeDomain,
    setAnalyzeDomain,
    handleRerunAnalysis
  };
};

export default useDashboardState;

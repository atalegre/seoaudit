
import { useEffect, useState } from 'react';
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
export const useDashboardState = (urlParam?: string) => {
  const {
    url,
    domain,
    lastAnalysisDate
  } = useUrlState();

  const actualUrl = urlParam || url;
  const [isEmpty, setIsEmpty] = useState(false);

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
    if (actualUrl) {
      // Fetch logo for the website
      fetchLogo(actualUrl);
      
      // Calculate scores based on domain
      calculateScores(domain);
      
      // Generate recommendations based on scores
      setTimeout(() => {
        generateRecommendations(seoScore, aioScore, performanceScore);
      }, 100);

      // Reset empty state
      setIsEmpty(false);
    }
  }, [actualUrl, domain]);

  /**
   * Handler to re-run analysis
   */
  const handleRerunAnalysis = () => {
    if (!actualUrl) {
      toast.error("URL não definida", {
        description: "Digite um URL para analisar"
      });
      return;
    }
    
    runAnalysis(actualUrl, () => {
      // Recalculate scores
      calculateScores(domain);
      
      // Regenerate recommendations
      generateRecommendations(seoScore, aioScore, performanceScore);
    });
  };

  return {
    url: actualUrl,
    domain,
    lastAnalysisDate,
    isLoading,
    isEmpty,
    logoUrl,
    totalScore,
    seoScore,
    aioScore,
    llmScore,
    performanceScore,
    directoryScore,
    keywordScore,
    recommendations,
    handleRerunAnalysis
  };
};

export default useDashboardState;

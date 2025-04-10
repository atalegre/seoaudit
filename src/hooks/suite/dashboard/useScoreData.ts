
import { useState } from 'react';
import { extractDomainFromUrl } from '@/utils/domainUtils';

/**
 * Hook that provides score-related data and calculations
 */
export function useScoreData(domain: string) {
  // Score state
  const [totalScore, setTotalScore] = useState<number>(0);
  const [seoScore, setSeoScore] = useState<number>(0);
  const [aioScore, setAioScore] = useState<number>(0);
  const [llmScore, setLlmScore] = useState<number>(0);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [directoryScore, setDirectoryScore] = useState<number>(0);
  const [keywordScore, setKeywordScore] = useState<number>(0);

  /**
   * Calculates and sets scores based on the domain
   */
  const calculateScores = (domain: string) => {
    if (!domain) return;
    
    // Generate scores based on domain (deterministic)
    const seed = domain.length * 7 % 40; // Value between 0 and 39
    
    const calculatedSeoScore = Math.min(100, Math.max(30, 50 + seed));
    const calculatedAioScore = Math.min(100, Math.max(20, 45 + seed * 0.8));
    const calculatedLlmScore = Math.min(100, Math.max(10, 30 + seed * 0.7));
    const calculatedPerformanceScore = Math.min(100, Math.max(40, 60 + seed * 0.5));
    const calculatedDirectoryScore = Math.min(100, Math.max(20, 40 + seed * 0.6));
    const calculatedKeywordScore = Math.min(100, Math.max(30, 50 + seed * 0.7));
    
    // Set the scores
    setSeoScore(calculatedSeoScore);
    setAioScore(calculatedAioScore);
    setLlmScore(calculatedLlmScore);
    setPerformanceScore(calculatedPerformanceScore);
    setDirectoryScore(calculatedDirectoryScore);
    setKeywordScore(calculatedKeywordScore);
    
    // Calculate total score (weighted average)
    const total = Math.round(
      (calculatedSeoScore * 0.5) + 
      (calculatedAioScore * 0.3) + 
      (calculatedLlmScore * 0.2)
    );
    setTotalScore(total);
  };

  return {
    totalScore,
    seoScore,
    aioScore,
    llmScore,
    performanceScore,
    directoryScore, 
    keywordScore,
    calculateScores
  };
}

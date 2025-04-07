
import { useState, useRef } from 'react';
import { AnalysisResult } from '@/utils/api/types';

/**
 * Custom hook to manage the state for website analysis
 */
export function useAnalysisState() {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [aioError, setAioError] = useState<string | null>(null);
  const analysisInProgress = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  return {
    isLoading,
    setIsLoading,
    analysisData,
    setAnalysisData,
    error,
    setError,
    seoError,
    setSeoError,
    aioError,
    setAioError,
    analysisInProgress,
    abortControllerRef
  };
}

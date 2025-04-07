
import { useEffect, useCallback } from 'react';
import { useAnalysisState } from './useAnalysisState';
import { loadFromCache, saveToCache, notifyCachedData, clearCache } from './analysisCache';
import { performAnalysis, notifyAnalysisStarted, notifyAnalysisError } from './analysisService';

/**
 * Hook for website analysis with caching support
 */
export function useAnalysis(urlParam: string | null) {
  const {
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
  } = useAnalysisState();

  useEffect(() => {
    if (!urlParam) {
      setIsLoading(false);
      setError("URL não fornecido");
      return;
    }

    // Cleanup previous analysis if running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Check for cached analysis
    const { validCache, cachedAnalysis } = loadFromCache(urlParam);
    
    if (validCache && cachedAnalysis) {
      // Use microtasks to not block rendering
      queueMicrotask(() => {
        setAnalysisData(cachedAnalysis);
        setIsLoading(false);
        notifyCachedData();
      });
      return;
    }
    
    // Prevent multiple parallel analysis requests
    if (analysisInProgress.current) {
      return;
    }
    
    analysisInProgress.current = true;
    setIsLoading(true);
    setSeoError(null);
    setAioError(null);
    
    // Progressive loading strategy
    const analyzeUrl = async () => {
      try {
        notifyAnalysisStarted();
        
        const finalResults = await performAnalysis(
          urlParam, 
          abortControllerRef.current!.signal,
          {
            onPartialResults: (partialResults) => {
              setAnalysisData(partialResults);
            },
            onSeoError: (error) => {
              setSeoError(error);
            },
            onAioError: (error) => {
              setAioError(error);
            }
          }
        );
        
        // Save the final results to cache
        saveToCache(urlParam, finalResults);
        setAnalysisData(finalResults);
        
      } catch (error) {
        console.error('Error performing analysis:', error);
        notifyAnalysisError();
        setError("Ocorreu um erro ao analisar o site");
      } finally {
        setIsLoading(false);
        analysisInProgress.current = false;
        abortControllerRef.current = null;
      }
    };
    
    // Start analysis in next frame to not block the interface
    requestAnimationFrame(() => {
      analyzeUrl();
    });
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      analysisInProgress.current = false;
    };
  }, [urlParam]);

  const handleReanalyze = useCallback(() => {
    clearCache();
    window.location.reload();
  }, []);

  return {
    isLoading,
    analysisData,
    error,
    seoError,
    aioError,
    handleReanalyze
  };
}

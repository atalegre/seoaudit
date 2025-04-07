
import { useEffect, useCallback } from 'react';
import { useAnalysisState } from './useAnalysisState';
import { loadFromCache, saveToCache, notifyCachedData, clearCache } from './analysisCache';
import { performAnalysis, notifyAnalysisStarted, notifyAnalysisError } from './analysisService';
import { toast } from 'sonner';

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
    setError(null);
    
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
              toast.error('Erro na análise SEO', {
                description: error,
              });
            },
            onAioError: (error) => {
              setAioError(error);
              toast.error('Erro na análise AIO', {
                description: error,
              });
            }
          }
        );
        
        // Verificar se temos dados reais suficientes
        const hasSeoData = finalResults.seo && finalResults.seo.score > 0 && !finalResults.seo.isError;
        const hasAioData = finalResults.aio && finalResults.aio.score > 0;
        
        if (!hasSeoData && !hasAioData) {
          throw new Error("Nenhum dado real foi obtido nas análises. Verifique as APIs e tente novamente.");
        }
        
        // Save the final results to cache
        saveToCache(urlParam, finalResults);
        setAnalysisData(finalResults);
        
      } catch (error) {
        console.error('Error performing analysis:', error);
        notifyAnalysisError();
        setError(error instanceof Error ? error.message : "Ocorreu um erro ao analisar o site");
        setAnalysisData(null);
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
    toast.info('Iniciando nova análise com dados reais', {
      description: 'O cache foi limpo e estamos buscando dados atualizados'
    });
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

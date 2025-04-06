
import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisResult } from '@/utils/api/types';
import { getPageInsightsData } from '@/utils/api';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { createAnalysisResult } from '@/utils/resultsPageHelpers';
import { extractDomainFromUrl } from '@/utils/domainUtils';
import { toast } from 'sonner';

const ANALYSIS_STORAGE_KEY = 'web_analysis_results';
const ANALYSIS_URL_KEY = 'web_analysis_url';
const CACHE_TTL = 1000 * 60 * 30; // 30 min cache

export function useAnalysis(urlParam: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [aioError, setAioError] = useState<string | null>(null);
  const analysisInProgress = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

    const storedUrl = localStorage.getItem(ANALYSIS_URL_KEY);
    const storedAnalysis = localStorage.getItem(ANALYSIS_STORAGE_KEY);
    const storedTimestamp = localStorage.getItem(ANALYSIS_STORAGE_KEY + '_time');
    
    // Check if we have valid cached data
    if (storedUrl === urlParam && storedAnalysis && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp);
      
      // Use cache if it's not expired
      if (Date.now() - timestamp < CACHE_TTL) {
        try {
          console.log('Usando análise em cache para URL:', urlParam);
          const parsedAnalysis = JSON.parse(storedAnalysis) as AnalysisResult;
          
          // Garantir que temos um logo, mesmo que venha do cache
          if (!parsedAnalysis.logoUrl) {
            const domain = extractDomainFromUrl(urlParam);
            if (domain) {
              parsedAnalysis.logoUrl = `https://logo.clearbit.com/${domain}`;
            }
          }
          
          // Use a microtask to update state to avoid blocking rendering
          queueMicrotask(() => {
            setAnalysisData(parsedAnalysis);
            setIsLoading(false);
          });
          
          toast('Usando análise em cache', {
            description: 'Mostrando resultados da análise anterior',
            duration: 3000
          });
          return;
        } catch (parseError) {
          console.error('Erro ao analisar dados em cache:', parseError);
        }
      }
    }
    
    // Prevent multiple parallel analysis requests
    if (analysisInProgress.current) {
      return;
    }
    
    analysisInProgress.current = true;
    setIsLoading(true);
    setSeoError(null);
    setAioError(null);
    
    // Use rAF and microtasks to optimize rendering performance
    requestAnimationFrame(() => {
      const analyzeUrl = async () => {
        try {
          let normalizedUrl = urlParam;
          if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
          }
          
          toast('Análise em andamento...', {
            description: 'Aguarde enquanto analisamos o site.',
            duration: 3000
          });
          
          // Preparar o URL do logo antecipadamente para reduzir LCP
          const domain = extractDomainFromUrl(normalizedUrl);
          let logoUrl = null;
          if (domain) {
            logoUrl = `https://logo.clearbit.com/${domain}`;
            
            // Preload logo image to improve LCP
            const imgPreload = new Image();
            imgPreload.src = logoUrl;
          }
          
          // Otimizado: iniciar apenas a análise SEO inicialmente para melhorar o tempo de resposta
          const seoDataPromise = Promise.race([
            getPageInsightsData(normalizedUrl),
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout na análise SEO')), 15000)
            )
          ]);
          
          let seoData = null;
          
          try {
            seoData = await seoDataPromise;
          } catch (seoError) {
            setSeoError(seoError instanceof Error ? seoError.message : 'Erro desconhecido na análise SEO');
            console.error('Error fetching Page Insights data:', seoError);
          }
          
          // Se temos dados SEO, mostrar resultados parciais imediatamente
          if (seoData) {
            const partialResults = createAnalysisResult(normalizedUrl, seoData, null);
            if (logoUrl) {
              partialResults.logoUrl = logoUrl;
            }
            
            setAnalysisData(partialResults);
            // Manter loading true enquanto AIO análise continua
          }
          
          // Agora iniciar análise AIO em segundo plano
          let aioData = null;
          
          try {
            // AIO análise com timeout mais longo
            aioData = await Promise.race([
              getChatGptAnalysis(normalizedUrl),
              new Promise<null>((_, reject) => 
                setTimeout(() => reject(new Error('Timeout na análise AIO')), 25000)
              )
            ]);
          } catch (aioError) {
            setAioError(aioError instanceof Error ? aioError.message : 'Erro desconhecido na análise AIO');
            console.error('Error fetching AIO data:', aioError);
          }
          
          // Criar resultado final com todos os dados disponíveis
          const finalResults = createAnalysisResult(normalizedUrl, seoData, aioData as any);
          
          if (logoUrl) {
            finalResults.logoUrl = logoUrl;
          }
          
          // Guardar no cache com timestamp
          try {
            localStorage.setItem(ANALYSIS_URL_KEY, urlParam);
            localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(finalResults));
            localStorage.setItem(ANALYSIS_STORAGE_KEY + '_time', Date.now().toString());
          } catch (storageError) {
            console.warn('Não foi possível salvar no cache:', storageError);
          }
          
          setAnalysisData(finalResults);
          
        } catch (error) {
          console.error('Error performing analysis:', error);
          toast.error('Erro ao analisar site', {
            description: 'Não foi possível completar a análise do site.',
          });
          setError("Ocorreu um erro ao analisar o site");
        } finally {
          setIsLoading(false);
          analysisInProgress.current = false;
          abortControllerRef.current = null;
        }
      };
      
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
    localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    localStorage.removeItem(ANALYSIS_URL_KEY);
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

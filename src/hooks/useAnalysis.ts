
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

  // Função otimizada para carregar o logotipo antecipadamente
  const preloadLogo = useCallback((url: string) => {
    const domain = extractDomainFromUrl(url);
    if (!domain) return null;
    
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    
    // Usar Image() para precarregar a imagem
    const preloadImage = new Image();
    preloadImage.src = logoUrl;
    
    return logoUrl;
  }, []);

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
            parsedAnalysis.logoUrl = preloadLogo(urlParam);
          }
          
          // Usar estratégia de microtasks para não bloquear renderização
          queueMicrotask(() => {
            setAnalysisData(parsedAnalysis);
            setIsLoading(false);
            
            toast('Usando análise em cache', {
              description: 'Mostrando resultados da análise anterior',
              duration: 3000
            });
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
    
    // Estratégia de carregamento progressivo
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
        const logoUrl = preloadLogo(normalizedUrl);
        
        // Estratégia de carregamento paralelo otimizado
        let seoData = null;
        let aioData = null;
        
        // Iniciar ambas as requisições em paralelo, mas priorizar a exibição dos dados SEO
        // que são mais rápidos de obter
        const seoPromise = getPageInsightsData(normalizedUrl)
          .catch(error => {
            setSeoError(error instanceof Error ? error.message : 'Erro desconhecido na análise SEO');
            console.error('Error fetching Page Insights data:', error);
            return null;
          });
        
        const aioPromise = getChatGptAnalysis(normalizedUrl)
          .catch(error => {
            setAioError(error instanceof Error ? error.message : 'Erro desconhecido na análise AIO');
            console.error('Error fetching AIO data:', error);
            return null;
          });
        
        // Inicia ambas as promessas, mas dá prioridade à exibição dos primeiros resultados
        seoData = await seoPromise;
        
        // Se temos dados SEO, mostrar resultados parciais imediatamente
        if (seoData) {
          const partialResults = createAnalysisResult(normalizedUrl, seoData, null);
          if (logoUrl) {
            partialResults.logoUrl = logoUrl;
          }
          
          setAnalysisData(partialResults);
          // Ainda mantém loading true enquanto esperamos dados AIO
        }
        
        // Aguardar dados AIO (que já estava sendo carregado em paralelo)
        aioData = await aioPromise;
        
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
    
    // Iniciar análise no próximo frame para não bloquear a interface
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
  }, [urlParam, preloadLogo]);

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

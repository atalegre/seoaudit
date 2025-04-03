
import { useState, useEffect } from 'react';
import { AnalysisResult } from '@/utils/api/types';
import { getPageInsightsData } from '@/utils/api';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { createAnalysisResult } from '@/utils/resultsPageHelpers';
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

  useEffect(() => {
    if (!urlParam) {
      setIsLoading(false);
      setError("URL não fornecido");
      return;
    }

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
          setAnalysisData(parsedAnalysis);
          setIsLoading(false);
          toast('Usando análise em cache', {
            description: 'Mostrando resultados da análise anterior',
            duration: 3000
          });
          return;
        } catch (parseError) {
          console.error('Erro ao analisar dados em cache:', parseError);
        }
      } else {
        console.log('Cache expirado, obterá novos dados');
      }
    }
    
    console.log('Iniciando nova análise para URL:', urlParam);
    setIsLoading(true);
    setSeoError(null);
    setAioError(null);
    
    // Usar requestIdleCallback quando disponível para não bloquear a renderização
    const performAnalysis = async () => {
      try {
        let normalizedUrl = urlParam;
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
          normalizedUrl = 'https://' + normalizedUrl;
        }
        
        toast('Análise em andamento...', {
          description: 'Aguarde enquanto analisamos o site.',
          duration: 3000
        });
        
        // Iniciar as análises em paralelo
        const seoPromise = getPageInsightsData(normalizedUrl)
          .catch(err => {
            setSeoError(err instanceof Error ? err.message : 'Erro desconhecido na análise SEO');
            console.error('Error fetching Page Insights data:', err);
            return null;
          });
        
        // AIO Promise - now using a small delay to avoid conflicts
        const aioPromise = new Promise(resolve => {
          setTimeout(async () => {
            try {
              const data = await getChatGptAnalysis(normalizedUrl);
              resolve(data);
            } catch (err) {
              setAioError(err instanceof Error ? err.message : 'Erro desconhecido na análise AIO');
              console.error('Error fetching AIO data:', err);
              resolve(null);
            }
          }, 500);
        });
        
        // Resolver análises
        const [seoData, aioData] = await Promise.all([seoPromise, aioPromise]);
        
        if (!seoData && !aioData) {
          setError('Falha em ambas as análises. Por favor, verifique suas configurações de API.');
          setIsLoading(false);
          return;
        }
        
        const results = createAnalysisResult(normalizedUrl, seoData, aioData as any);
        
        // Guardar no cache com timestamp
        localStorage.setItem(ANALYSIS_URL_KEY, urlParam);
        localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(results));
        localStorage.setItem(ANALYSIS_STORAGE_KEY + '_time', Date.now().toString());
        
        setAnalysisData(results);
        
        console.log('Analysis completed:', results);
      } catch (error) {
        console.error('Error performing analysis:', error);
        toast.error('Erro ao analisar site', {
          description: 'Não foi possível completar a análise do site.',
        });
        setError("Ocorreu um erro ao analisar o site");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Usar requestIdleCallback se disponível
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        performAnalysis();
      });
    } else {
      // Fallback para setTimeout
      setTimeout(performAnalysis, 10);
    }
  }, [urlParam]);

  const handleReanalyze = () => {
    localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    localStorage.removeItem(ANALYSIS_URL_KEY);
    window.location.reload();
  };

  return {
    isLoading,
    analysisData,
    error,
    seoError,
    aioError,
    handleReanalyze
  };
}

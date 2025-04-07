
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getPageInsightsData } from '@/utils/api/pageInsights';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';
import { toast } from 'sonner';

export function useSeoAnalysis() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [desktopData, setDesktopData] = useState<PageInsightsData | null>(null);
  const [mobileData, setMobileData] = useState<PageInsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  // Carregar o último URL analisado ao inicializar
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastAnalyzedUrl');
    if (lastUrl) {
      setUrl(lastUrl);
      analyzeUrl(lastUrl);
    }
  }, []);

  const analyzeUrl = async (urlToAnalyze = url) => {
    if (!urlToAnalyze) {
      toast("URL necessário", {
        description: "Por favor, insira uma URL válida para analisar."
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Normalizar URL (adicionar https:// se não especificado)
      let normalizedUrl = urlToAnalyze;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      // Salvar a URL no localStorage
      localStorage.setItem('lastAnalyzedUrl', urlToAnalyze);
      
      // Obter dados para desktop e mobile usando a mesma API
      try {
        const desktopInsights = await getPageInsightsData(normalizedUrl);
        setDesktopData(desktopInsights);
        
        const mobileInsights = await getPageInsightsData(normalizedUrl);
        setMobileData(mobileInsights);
        
        toast.success("Análise concluída", {
          description: "Os resultados da análise SEO estão prontos."
        });
      } catch (apiError: any) {
        console.error("Erro ao analisar URL:", apiError);
        setError(apiError.message || 'Ocorreu um erro desconhecido');
        
        toast.error("Erro na análise", {
          description: apiError.message || 'Ocorreu um erro desconhecido'
        });
      }
    } catch (error: any) {
      console.error("Erro ao analisar URL:", error);
      setError(error.message || 'Ocorreu um erro desconhecido');
      
      toast.error("Erro na análise", {
        description: error.message || 'Ocorreu um erro desconhecido'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleReanalyze = () => {
    analyzeUrl();
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (e) {
      return url;
    }
  };

  return {
    url,
    isAnalyzing,
    desktopData,
    mobileData,
    error,
    handleUrlChange,
    handleReanalyze,
    extractDomain
  };
}

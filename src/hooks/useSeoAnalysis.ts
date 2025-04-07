
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getPageInsightsData } from '@/utils/api/pageInsights';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';

export function useSeoAnalysis() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [desktopData, setDesktopData] = useState<PageInsightsData | null>(null);
  const [mobileData, setMobileData] = useState<PageInsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      toast({
        title: "URL necessário",
        description: "Por favor, insira uma URL válida para analisar.",
        variant: "destructive",
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
      
      // Simular carregamento sequencial (desktop primeiro, depois mobile)
      const desktopInsights = await getPageInsightsData(normalizedUrl);
      setDesktopData(desktopInsights);
      
      // Em uma implementação real, você teria diferentes endpoints/parâmetros para mobile
      const mobileInsights = await getPageInsightsData(normalizedUrl);
      setMobileData(mobileInsights);
      
      toast({
        title: "Análise concluída",
        description: "Os resultados da análise SEO estão prontos.",
      });
    } catch (error) {
      console.error("Erro ao analisar URL:", error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido';
      setError(errorMessage);
      
      toast({
        title: "Erro na análise",
        description: errorMessage,
        variant: "destructive",
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

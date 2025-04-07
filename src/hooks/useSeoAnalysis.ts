
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getPageInsightsData } from '@/utils/api/pageInsights';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';

export function useSeoAnalysis() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [desktopData, setDesktopData] = useState<PageInsightsData | null>(null);
  const [mobileData, setMobileData] = useState<PageInsightsData | null>(null);
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
      
      // Salvar a URL no localStorage
      localStorage.setItem('lastAnalyzedUrl', urlToAnalyze);
      
      // Simular carregamento sequencial (desktop primeiro, depois mobile)
      const desktopInsights = await getPageInsightsData(urlToAnalyze);
      setDesktopData(desktopInsights);
      
      // Em uma implementação real, você teria diferentes endpoints/parâmetros para mobile
      const mobileInsights = await getPageInsightsData(urlToAnalyze);
      setMobileData(mobileInsights);
      
      toast({
        title: "Análise concluída",
        description: "Os resultados da análise SEO estão prontos.",
      });
    } catch (error) {
      console.error("Erro ao analisar URL:", error);
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao analisar a URL. Tente novamente.",
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
    handleUrlChange,
    handleReanalyze,
    extractDomain
  };
}

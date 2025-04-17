
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getPageInsightsData, getApiKey } from '@/utils/api/pageInsights';
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
      
      // Verificar se a chave API está configurada
      const apiKey = getApiKey();
      if (!apiKey) {
        toast.error("Chave API não configurada", {
          description: "Configure a variável de ambiente VITE_PAGESPEED_API_KEY com sua chave Google API."
        });
        setError("Chave API PageSpeed não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY.");
        setIsAnalyzing(false);
        return;
      }
      
      console.log(`🔑 Chave API configurada (primeiros 4 caracteres): ${apiKey.substring(0, 4)}...`);
      
      // Normalizar URL (adicionar https:// se não especificado)
      let normalizedUrl = urlToAnalyze;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      console.log(`🔍 URL normalizada para análise: ${normalizedUrl}`);
      
      // Salvar a URL no localStorage
      localStorage.setItem('lastAnalyzedUrl', normalizedUrl);
      
      // Obter dados para desktop e mobile usando a mesma API com estratégia diferente
      toast.info("Analisando...", {
        description: "Obtendo dados reais de SEO, isso pode levar alguns segundos."
      });
      
      // Variáveis para rastrear resultados de cada análise
      let desktopError: Error | null = null;
      let mobileError: Error | null = null;
      let desktopResult: PageInsightsData | null = null;
      let mobileResult: PageInsightsData | null = null;
      
      // Analisar desktop
      try {
        console.log('🖥️ Iniciando análise desktop...');
        desktopResult = await getPageInsightsData(normalizedUrl, 'desktop');
        setDesktopData(desktopResult);
        console.log("✅ Análise desktop concluída com sucesso");
      } catch (error: any) {
        console.error("❌ Erro ao analisar desktop:", error);
        desktopError = error;
      }
      
      // Analisar mobile
      try {
        console.log('📱 Iniciando análise mobile...');
        mobileResult = await getPageInsightsData(normalizedUrl, 'mobile');
        setMobileData(mobileResult);
        console.log("✅ Análise mobile concluída com sucesso");
      } catch (error: any) {
        console.error("❌ Erro ao analisar mobile:", error);
        mobileError = error;
      }
      
      // Verificar resultados e mostrar mensagens apropriadas
      if (desktopResult || mobileResult) {
        // Pelo menos um dispositivo foi analisado com sucesso
        console.log("✅ Análise concluída com pelo menos um dispositivo");
        
        // Mostrar toast de sucesso mesmo com dados parciais
        toast.success("Análise concluída", {
          description: "Os resultados da análise SEO estão prontos."
        });
        
        // Definir mensagens de erro específicas para análises parciais
        if (!desktopResult && mobileResult) {
          console.log("⚠️ Apenas dados mobile disponíveis");
          setError("A análise desktop falhou, mas os dados mobile estão disponíveis.");
          toast.warning("Dados parciais", {
            description: "A análise desktop falhou. Mostrando apenas dados mobile."
          });
        } else if (desktopResult && !mobileResult) {
          console.log("⚠️ Apenas dados desktop disponíveis");
          setError("A análise mobile falhou, mas os dados desktop estão disponíveis.");
          toast.warning("Dados parciais", {
            description: "A análise mobile falhou. Mostrando apenas dados desktop."
          });
        }
      } else {
        // Ambas as análises falharam
        console.error("❌ Ambas as análises (desktop e mobile) falharam");
        let errorMessage = "Não foi possível obter dados reais para desktop ou mobile. ";
        
        // Combinar mensagens de erro para fornecer detalhes mais úteis
        if (desktopError && mobileError) {
          errorMessage += `Erro desktop: ${desktopError.message}. Erro mobile: ${mobileError.message}`;
        } else if (desktopError) {
          errorMessage += `Erro: ${desktopError.message}`;
        } else if (mobileError) {
          errorMessage += `Erro: ${mobileError.message}`;
        }
        
        setError(errorMessage);
        toast.error("Erro na análise", {
          description: "Falha ao obter dados reais. Verifique a configuração de API."
        });
      }
    } catch (error: any) {
      console.error("❌ Erro geral ao analisar URL:", error);
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
    // Limpar o cache do sessionStorage para o URL analisado
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('psi_')) {
        console.log('🧹 Limpando cache:', key);
        sessionStorage.removeItem(key);
      }
    });
    
    // Limpar também o cache em memória (apiCache)
    toast.info("Cache limpo, iniciando nova análise", {
      description: "Tentando obter dados atualizados da API"
    });
    
    // Limpar os dados atuais para forçar uma nova análise completa
    setDesktopData(null);
    setMobileData(null);
    setError(null);
    
    // Analisar novamente
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


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
      localStorage.setItem('lastAnalyzedUrl', urlToAnalyze);
      
      // Obter dados para desktop e mobile usando a mesma API com estratégia diferente
      toast.info("Analisando...", {
        description: "Obtendo dados reais de SEO, isso pode levar alguns segundos."
      });
      
      try {
        // Analisar desktop primeiro
        try {
          console.log('🖥️ Iniciando análise desktop...');
          const desktopResult = await getPageInsightsData(normalizedUrl, 'desktop');
          setDesktopData(desktopResult);
          console.log("✅ Análise desktop concluída com sucesso");
        } catch (desktopError: any) {
          console.error("❌ Erro ao analisar desktop:", desktopError);
          // Não definir erro global ainda, tentar mobile
        }
        
        // Agora analisar mobile
        try {
          console.log('📱 Iniciando análise mobile...');
          const mobileResult = await getPageInsightsData(normalizedUrl, 'mobile');
          setMobileData(mobileResult);
          console.log("✅ Análise mobile concluída com sucesso");
        } catch (mobileError: any) {
          console.error("❌ Erro ao analisar mobile:", mobileError);
          // Não definir erro global ainda, verificar se temos dados de desktop
        }
        
        // Verificar se temos algum dado
        if (desktopData || mobileData) {
          // Pelo menos um foi bem-sucedido
          toast.success("Análise concluída", {
            description: "Os resultados da análise SEO estão prontos."
          });
          
          // Se um falhou mas temos o outro, definir um erro específico
          if (!desktopData && mobileData) {
            setError("A análise desktop falhou, mas os dados mobile estão disponíveis.");
          } else if (desktopData && !mobileData) {
            setError("A análise mobile falhou, mas os dados desktop estão disponíveis.");
          }
        } else {
          // Ambos falharam
          throw new Error("Não foi possível obter dados para desktop ou mobile. Verifique as configurações de API.");
        }
      } catch (apiError: any) {
        console.error("❌ Erro ao analisar URL:", apiError);
        setError(apiError.message || 'Ocorreu um erro desconhecido');
        
        toast.error("Erro na análise", {
          description: "Falha ao conectar com a API. Verifique a configuração e tente novamente."
        });
      }
    } catch (error: any) {
      console.error("❌ Erro ao analisar URL:", error);
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

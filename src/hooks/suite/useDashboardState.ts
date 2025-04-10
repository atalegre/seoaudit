
import { useState, useEffect } from 'react';
import { fetchSiteLogo } from '@/utils/api/logoService';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';

export function useDashboardState() {
  const [url, setUrl] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [lastAnalysisDate, setLastAnalysisDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Estado para pontuações
  const [totalScore, setTotalScore] = useState<number>(0);
  const [seoScore, setSeoScore] = useState<number>(0);
  const [aioScore, setAioScore] = useState<number>(0);
  const [llmScore, setLlmScore] = useState<number>(0);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [directoryScore, setDirectoryScore] = useState<number>(0);
  const [keywordScore, setKeywordScore] = useState<number>(0);
  
  // Estado para análise e recomendações
  const [analyzeDomain, setAnalyzeDomain] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  // Carregar dados iniciais
  useEffect(() => {
    const storedUrl = localStorage.getItem('lastAnalyzedUrl');
    if (storedUrl) {
      setUrl(storedUrl);
      loadDataForUrl(storedUrl);
    }
  }, []);
  
  // Gerar dados simulados para uma URL
  const loadDataForUrl = async (targetUrl: string) => {
    try {
      setIsLoading(true);
      
      // Extrair domínio da URL para exibição
      const extractedDomain = extractDomainFromUrl(targetUrl);
      setDomain(extractedDomain);
      
      // Definir a data da última análise
      setLastAnalysisDate(new Date().toLocaleDateString());
      
      // Buscar logo do site (se possível)
      try {
        const logo = await fetchSiteLogo(targetUrl);
        setLogoUrl(logo);
      } catch (error) {
        console.error('Erro ao buscar logo:', error);
        setLogoUrl(null);
      }
      
      // Simular carregamento dos dados
      setTimeout(() => {
        // Gerar pontuações baseadas no domínio de forma determinística
        // (para que o mesmo site sempre tenha pontuações similares)
        const seed = extractedDomain.length * 7 % 40; // Valor entre 0 e 39
        
        const calculatedSeoScore = Math.min(100, Math.max(30, 50 + seed));
        const calculatedAioScore = Math.min(100, Math.max(20, 45 + seed * 0.8));
        const calculatedLlmScore = Math.min(100, Math.max(10, 30 + seed * 0.7));
        const calculatedPerformanceScore = Math.min(100, Math.max(40, 60 + seed * 0.5));
        const calculatedDirectoryScore = Math.min(100, Math.max(20, 40 + seed * 0.6));
        const calculatedKeywordScore = Math.min(100, Math.max(30, 50 + seed * 0.7));
        
        // Definir as pontuações
        setSeoScore(calculatedSeoScore);
        setAioScore(calculatedAioScore);
        setLlmScore(calculatedLlmScore);
        setPerformanceScore(calculatedPerformanceScore);
        setDirectoryScore(calculatedDirectoryScore);
        setKeywordScore(calculatedKeywordScore);
        
        // Calcular pontuação total (média ponderada)
        const total = Math.round(
          (calculatedSeoScore * 0.5) + 
          (calculatedAioScore * 0.3) + 
          (calculatedLlmScore * 0.2)
        );
        setTotalScore(total);
        
        // Gerar recomendações baseadas nas pontuações
        generateRecommendations(
          calculatedSeoScore, 
          calculatedAioScore, 
          calculatedPerformanceScore
        );
        
        setIsLoading(false);
        
        toast.success("Análise concluída", {
          description: `Análise de ${extractedDomain} pronta para visualização.`,
          duration: 4000
        });
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setIsLoading(false);
      toast.error("Erro na análise", {
        description: "Não foi possível analisar o site. Tente novamente."
      });
    }
  };
  
  // Gerar recomendações com base nas pontuações
  const generateRecommendations = (
    seoScore: number, 
    aioScore: number, 
    performanceScore: number
  ) => {
    const recommendations = [];
    
    // Recomendações de SEO
    if (seoScore < 50) {
      recommendations.push({
        id: 'seo1',
        title: 'Melhorar tempos de carregamento',
        description: 'O site está lento, especialmente em mobile. Otimize imagens e considere um CDN.',
        type: 'seo',
        impact: 'high'
      });
    }
    
    if (seoScore < 70) {
      recommendations.push({
        id: 'seo2',
        title: 'Otimizar meta tags',
        description: 'As meta descrições estão ausentes ou são muito longas. Adicione descrições concisas.',
        type: 'seo',
        impact: 'medium'
      });
    }
    
    if (performanceScore < 60) {
      recommendations.push({
        id: 'seo3',
        title: 'Reduzir JavaScript não utilizado',
        description: 'Existe código JavaScript que está bloqueando o carregamento da página.',
        type: 'seo',
        impact: 'medium'
      });
    }
    
    // Recomendações de AIO
    if (aioScore < 60) {
      recommendations.push({
        id: 'aio1',
        title: 'Melhorar estrutura de headings',
        description: 'A hierarquia de H1-H6 não está clara. Reorganize para ajudar modelos de IA a entender o conteúdo.',
        type: 'aio',
        impact: 'high'
      });
    }
    
    if (aioScore < 70) {
      recommendations.push({
        id: 'aio2',
        title: 'Adicionar FAQ schema markup',
        description: 'Implemente marcação de dados estruturados para perguntas frequentes para melhorar visibilidade em IA.',
        type: 'aio',
        impact: 'medium'
      });
    }
    
    recommendations.push({
      id: 'aio3',
      title: 'Adicionar conteúdo explicativo',
      description: 'Crie textos mais detalhados explicando conceitos-chave que os modelos de IA podem referenciar.',
      type: 'aio',
      impact: 'medium'
    });
    
    // Sempre adicionar algumas recomendações gerais
    recommendations.push({
      id: 'general1',
      title: 'Criar página "Sobre"',
      description: 'Adicione uma página detalhada sobre sua empresa e missão para melhorar a presença em modelos de IA.',
      type: 'aio',
      impact: 'low'
    });
    
    recommendations.push({
      id: 'general2',
      title: 'Melhorar links internos',
      description: 'Adicione mais links entre páginas relacionadas para melhorar a navegação e indexação.',
      type: 'seo',
      impact: 'medium'
    });
    
    setRecommendations(recommendations);
  };
  
  // Função para re-analisar o site atual
  const handleRerunAnalysis = () => {
    if (!url) {
      toast.error("Nenhum URL para analisar", {
        description: "Por favor, insira um URL para análise primeiro."
      });
      return;
    }
    
    // Limpar dados de cache (em uma implementação real, isso seria mais elaborado)
    toast.info("Iniciando nova análise", {
      description: `Analisando ${url} novamente.`
    });
    
    loadDataForUrl(url);
  };
  
  return {
    url,
    domain,
    lastAnalysisDate,
    isLoading,
    logoUrl,
    totalScore,
    seoScore,
    aioScore,
    llmScore,
    performanceScore,
    directoryScore,
    keywordScore,
    recommendations,
    analyzeDomain,
    setAnalyzeDomain,
    handleRerunAnalysis
  };
}


import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchSiteLogo } from '@/utils/api/logoService';
import { formatDomainFromUrl } from '@/utils/domainUtils';

export interface SampleRecommendation {
  id: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'technical' | 'content' | 'structure' | 'ai';
}

export const useDashboardState = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [analyzeDomain, setAnalyzeDomain] = useState('');
  
  // Sample data for the dashboard
  const seoScore = 72;
  const aioScore = 65;
  const llmScore = 45;
  const performanceScore = 80;
  const directoryScore = 30;
  const keywordScore = 58;
  const totalScore = Math.round((seoScore + aioScore + llmScore + performanceScore + directoryScore) / 5);
  
  // Sample recommendations
  const recommendations: SampleRecommendation[] = [
    {
      id: 1,
      title: 'Meta descrição muito curta',
      description: 'A meta descrição da sua página inicial tem apenas 45 caracteres. Recomendamos expandir para 120-155 caracteres.',
      impact: 'medium',
      type: 'technical'
    },
    {
      id: 2,
      title: 'Conteúdo pouco otimizado para IA',
      description: 'O conteúdo da página não utiliza linguagem natural suficiente para ser bem interpretado por sistemas de IA.',
      impact: 'high',
      type: 'ai'
    },
    {
      id: 3,
      title: 'Imagens sem texto alternativo',
      description: 'Foram encontradas 12 imagens sem atributo alt definido, o que prejudica a acessibilidade e SEO.',
      impact: 'medium',
      type: 'technical'
    }
  ];
  
  // Fetch logo when URL changes
  useEffect(() => {
    if (url) {
      localStorage.setItem('lastAnalyzedUrl', url);
      toast.success(`Site analisado: ${url}`, {
        description: "Os resultados estão disponíveis no dashboard."
      });
      
      // Fetch logo for the domain
      const fetchLogo = async () => {
        try {
          const logo = await fetchSiteLogo(url);
          if (logo) {
            setLogoUrl(logo);
          }
        } catch (error) {
          console.error('Erro ao buscar logo:', error);
        }
      };
      
      fetchLogo();
    }
  }, [url]);
  
  const handleRerunAnalysis = () => {
    setIsLoading(true);
    toast.info("Iniciando nova análise...", {
      description: "Este processo pode demorar alguns segundos."
    });
    
    // Simulate analysis
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Análise concluída com sucesso!", {
        description: "Os resultados foram atualizados."
      });
    }, 3000);
  };
  
  const domain = formatDomainFromUrl(url);
  const lastAnalysisDate = new Date().toLocaleDateString('pt-PT');
  
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
};

export default useDashboardState;

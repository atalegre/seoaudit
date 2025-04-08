
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { fetchSiteLogo } from '@/utils/api/logoService';
import { Button } from '@/components/ui/button';
import { Globe, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAnalyzerRedirect } from '@/hooks/useAnalyzerRedirect';

// Import refactored components
import OverallScore from '@/components/suite/dashboard/OverallScore';
import ScoreCardsGrid from '@/components/suite/dashboard/ScoreCardsGrid';
import RecommendationsSection from '@/components/suite/dashboard/RecommendationsSection';
import HistoryTabs from '@/components/suite/dashboard/HistoryTabs';

interface SampleRecommendation {
  id: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'technical' | 'content' | 'structure' | 'ai';
}

const SuiteDashboard = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const { toast: hookToast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [analyzeDomain, setAnalyzeDomain] = useState('');
  const navigate = useNavigate();
  const { isAnalyzing, handleAnalyzeAndRedirect } = useAnalyzerRedirect();
  
  // Sample data - in a real app, this would come from an API
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
  
  const handleViewMoreRecommendations = () => {
    if (!user) {
      hookToast({
        title: "Login necessário",
        description: "Faça login para ver todas as recomendações detalhadas.",
      });
      return;
    }
    
    // Navigate to recommendations page
  };
  
  const formatDomain = (url: string) => {
    try {
      if (!url) return '';
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (e) {
      return url;
    }
  };
  
  const domain = formatDomain(url);
  const lastAnalysisDate = new Date().toLocaleDateString('pt-PT');
  
  const handleSubmitDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analyzeDomain) {
      toast.error("Por favor, insira um URL válido");
      return;
    }
    handleAnalyzeAndRedirect(analyzeDomain);
  };
  
  // Renderize o estado vazio se não houver URL para análise
  if (!url) {
    return (
      <SuiteLayout 
        title="Dashboard" 
        domain={''} 
        lastAnalysisDate={''}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
          <div className="rounded-full bg-blue-100 p-6 inline-flex">
            <Globe className="h-12 w-12 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Bem-vindo à Suite de Análise</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Para começar, insira o domínio do seu website para analisar sua presença online e otimizar seu desempenho.
            </p>
          </div>
          
          <form onSubmit={handleSubmitDomain} className="w-full max-w-md space-y-4">
            <div className="flex w-full max-w-md items-center space-x-2">
              <Input
                type="text"
                placeholder="www.seudominio.com"
                value={analyzeDomain}
                onChange={(e) => setAnalyzeDomain(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? "Analisando..." : "Analisar"}
                {!isAnalyzing && <Search className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
          
          <div className="border rounded-lg p-6 bg-gray-50 max-w-md w-full mt-8">
            <h3 className="text-lg font-medium mb-2">Por que analisar seu site?</h3>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li>• Melhore seu ranking nos motores de busca</li>
              <li>• Otimize para experiências com IA</li>
              <li>• Verifique sua presença online em diretórios</li>
              <li>• Identifique oportunidades de melhoria técnica</li>
              <li>• Acompanhe seu desempenho ao longo do tempo</li>
            </ul>
          </div>
        </div>
      </SuiteLayout>
    );
  }
  
  return (
    <SuiteLayout 
      title="Dashboard" 
      domain={domain} 
      lastAnalysisDate={lastAnalysisDate}
      onRerunAnalysis={handleRerunAnalysis}
      isAnalyzing={isLoading}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Visão Geral do Site</h1>
        <p className="text-muted-foreground">
          Resumo da análise para {domain || 'seu site'}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <OverallScore 
          totalScore={totalScore} 
          logoUrl={logoUrl} 
          domain={domain} 
        />
        
        <ScoreCardsGrid 
          seoScore={seoScore}
          aioScore={aioScore}
          llmScore={llmScore}
          performanceScore={performanceScore}
          directoryScore={directoryScore}
          keywordScore={keywordScore}
        />
      </div>
      
      <RecommendationsSection 
        recommendations={recommendations}
        onViewMore={handleViewMoreRecommendations}
      />
      
      <HistoryTabs 
        isUserLoggedIn={!!user} 
        onLogin={() => {}} // Add navigation to login page when needed
      />
    </SuiteLayout>
  );
};

export default SuiteDashboard;

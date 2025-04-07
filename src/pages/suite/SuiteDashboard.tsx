
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScoreCard from '@/components/suite/dashboard/ScoreCard';
import CircularProgress from '@/components/suite/dashboard/CircularProgress';
import RecommendationCard from '@/components/suite/dashboard/RecommendationCard';
import { 
  ArrowRight, Settings, Bot, Globe, MapPin, RefreshCw,
  KeySquare, Brain, Zap
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

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
        <Card className="col-span-full lg:col-span-1 row-span-2">
          <CardHeader>
            <CardTitle>Pontuação Geral</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress 
              value={totalScore} 
              size={180} 
              color="stroke-blue-600"
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold">{totalScore}</span>
                <span className="text-sm text-muted-foreground">de 100</span>
              </div>
            </CircularProgress>
          </CardContent>
        </Card>
        
        <ScoreCard 
          title="SEO Score" 
          score={seoScore} 
          icon={<Settings />} 
          color="text-blue-600" 
          bgColor="bg-blue-100" 
        />
        
        <ScoreCard 
          title="AIO Score" 
          score={aioScore} 
          icon={<Bot />} 
          color="text-purple-600" 
          bgColor="bg-purple-100" 
        />
        
        <ScoreCard 
          title="Presença em IA" 
          score={llmScore} 
          icon={<Globe />} 
          color="text-indigo-600" 
          bgColor="bg-indigo-100" 
        />
        
        <ScoreCard 
          title="Performance Técnica" 
          score={performanceScore} 
          icon={<Zap />} 
          color="text-green-600" 
          bgColor="bg-green-100" 
        />
        
        <ScoreCard 
          title="Presença em Diretórios" 
          score={directoryScore} 
          icon={<MapPin />} 
          color="text-orange-600" 
          bgColor="bg-orange-100" 
        />
        
        <ScoreCard 
          title="Keywords Tracking" 
          score={keywordScore} 
          icon={<KeySquare />} 
          color="text-yellow-600" 
          bgColor="bg-yellow-100" 
        />
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recomendações Principais</h2>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewMoreRecommendations}
          >
            Ver todas 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(rec => (
            <RecommendationCard
              key={rec.id}
              title={rec.title}
              description={rec.description}
              impact={rec.impact}
              type={rec.type}
              onLearnMore={handleViewMoreRecommendations}
            />
          ))}
        </div>
      </div>
      
      {user ? (
        <div className="mt-8">
          <Tabs defaultValue="seo">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="seo">Evolução SEO</TabsTrigger>
              <TabsTrigger value="aio">Evolução AIO</TabsTrigger>
              <TabsTrigger value="llm">Evolução LLM</TabsTrigger>
            </TabsList>
            <TabsContent value="seo" className="mt-6">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de evolução SEO</p>
              </div>
            </TabsContent>
            <TabsContent value="aio" className="mt-6">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de evolução AIO</p>
              </div>
            </TabsContent>
            <TabsContent value="llm" className="mt-6">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de evolução LLM</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Faça login para ver dados históricos e todas as recomendações
              </h3>
              <p className="text-muted-foreground mb-4">
                As informações detalhadas e o histórico de evolução estão disponíveis para utilizadores registados.
              </p>
              <Button>
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </SuiteLayout>
  );
};

export default SuiteDashboard;

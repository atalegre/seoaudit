
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScoreDisplay from '@/components/ScoreDisplay';
import AnalysisTabs from '@/components/AnalysisTabs';
import ReportForm from '@/components/ReportForm';
import { analyzeSite, AnalysisResult } from '@/utils/analyzerUtils';
import { Loader2 } from 'lucide-react';
import { getPageInsightsData } from '@/utils/api/pageInsightsService';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { toast } from 'sonner';

const ResultsPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  
  useEffect(() => {
    // Parse the URL parameter
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('url');
    
    if (!urlParam) {
      // Handle missing URL parameter
      setIsLoading(false);
      return;
    }
    
    // Set up loading state
    setIsLoading(true);
    
    const performAnalysis = async () => {
      try {
        // Buscar dados do Google Page Insights para SEO
        const seoData = await getPageInsightsData(urlParam);
        
        // Tentar buscar análise de AIO ou usar dados simulados
        let aioData;
        try {
          // Pass an empty string as content (or fetch the content if you have a way to do so)
          aioData = await getChatGptAnalysis(urlParam, '');
        } catch (error) {
          console.error('Error fetching AIO data:', error);
          toast('Usando dados simulados para análise de AIO', {
            description: 'Não foi possível conectar à API de IA.',
          });
          // Usar dados simulados para AIO
          aioData = analyzeSite(urlParam).aio;
        }
        
        // Combinar resultados
        const results: AnalysisResult = {
          url: urlParam,
          timestamp: new Date().toISOString(), // Add timestamp
          status: determineStatus(seoData.score, aioData.score),
          seo: seoData,
          aio: aioData,
          recommendations: generateRecommendations(seoData, aioData),
          overallStatus: determineStatus(seoData.score, aioData.score) // Add overallStatus
        };
        
        setAnalysisData(results);
      } catch (error) {
        console.error('Error performing analysis:', error);
        toast('Erro ao analisar site', {
          description: 'Usando dados simulados como fallback.',
        });
        // Fallback para dados simulados
        const results = analyzeSite(urlParam);
        setAnalysisData(results);
      } finally {
        setIsLoading(false);
      }
    };
    
    performAnalysis();
  }, [location.search]);
  
  const formatUrl = (url: string) => {
    // Format URL for display (remove http://, https://)
    return url.replace(/^https?:\/\//, '');
  };
  
  // Helper function to determine status based on scores
  function determineStatus(seoScore: number, aioScore: number): 'Saudável' | 'A melhorar' | 'Crítico' {
    const averageScore = (seoScore + aioScore) / 2;
    
    if (averageScore >= 80) return 'Saudável';
    if (averageScore >= 60) return 'A melhorar';
    return 'Crítico';
  }
  
  // Helper function to generate recommendations
  function generateRecommendations(seo: any, aio: any) {
    const recommendations = [];

    if (seo.loadTimeDesktop > 3) {
      recommendations.push({
        suggestion: 'Otimize o tempo de carregamento da página para desktop',
        seoImpact: 'Alto',
        aioImpact: 'Nenhum',
        priority: 9,
      });
    }

    if (seo.loadTimeMobile > 5) {
      recommendations.push({
        suggestion: 'Otimize o tempo de carregamento da página para mobile',
        seoImpact: 'Alto',
        aioImpact: 'Nenhum',
        priority: 9,
      });
    }

    if (!seo.mobileFriendly) {
      recommendations.push({
        suggestion: 'Torne o site mobile-friendly',
        seoImpact: 'Alto',
        aioImpact: 'Médio',
        priority: 8,
      });
    }

    if (!seo.security) {
      recommendations.push({
        suggestion: 'Implemente HTTPS no seu site',
        seoImpact: 'Alto',
        aioImpact: 'Nenhum',
        priority: 10,
      });
    }

    if (seo.imageOptimization < 60) {
      recommendations.push({
        suggestion: 'Otimize as imagens do site',
        seoImpact: 'Médio',
        aioImpact: 'Baixo',
        priority: 6,
      });
    }

    if (seo.headingsStructure < 60) {
      recommendations.push({
        suggestion: 'Melhore a estrutura de headings do site',
        seoImpact: 'Médio',
        aioImpact: 'Alto',
        priority: 7,
      });
    }

    if (seo.metaTags < 60) {
      recommendations.push({
        suggestion: 'Otimize as meta tags do site',
        seoImpact: 'Médio',
        aioImpact: 'Baixo',
        priority: 5,
      });
    }

    if (aio.contentClarity < 60) {
      recommendations.push({
        suggestion: 'Melhore a clareza do conteúdo do site',
        seoImpact: 'Baixo',
        aioImpact: 'Alto',
        priority: 7,
      });
    }

    if (aio.logicalStructure < 60) {
      recommendations.push({
        suggestion: 'Melhore a estrutura lógica do site',
        seoImpact: 'Baixo',
        aioImpact: 'Alto',
        priority: 6,
      });
    }

    if (aio.naturalLanguage < 60) {
      recommendations.push({
        suggestion: 'Melhore a linguagem natural do site',
        seoImpact: 'Baixo',
        aioImpact: 'Alto',
        priority: 5,
      });
    }
    
    return recommendations;
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">A analisar o seu site...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!analysisData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">URL em falta</h1>
            <p className="mb-6">Não foi possível analisar o URL. Por favor, tente novamente.</p>
            <a href="/" className="text-primary hover:underline">Voltar à página inicial</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 animate-fade-in">
            Resultados da análise
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ScoreDisplay
                seoScore={analysisData.seo.score}
                aioScore={analysisData.aio.score}
                status={analysisData.status}
                url={formatUrl(analysisData.url)}
              />
              
              <AnalysisTabs
                seoData={analysisData.seo}
                aioData={analysisData.aio}
                recommendations={analysisData.recommendations}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ReportForm url={analysisData.url} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

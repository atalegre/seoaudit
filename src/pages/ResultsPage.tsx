
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
import { formatUrl, createAnalysisResult } from '@/utils/resultsPageHelpers';

const ResultsPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('url');
    
    if (!urlParam) {
      setIsLoading(false);
      return;
    }
    
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
        
        // Criar resultado da análise
        const results = createAnalysisResult(urlParam, seoData, aioData);
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

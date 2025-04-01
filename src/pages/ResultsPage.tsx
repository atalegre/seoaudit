import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScoreDisplay from '@/components/ScoreDisplay';
import AnalysisTabs from '@/components/AnalysisTabs';
import ReportForm from '@/components/ReportForm';
import { AnalysisResult } from '@/utils/api/types';
import { Loader2 } from 'lucide-react';
import { getPageInsightsData } from '@/utils/api/pageInsightsService';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { toast } from 'sonner';
import { formatUrl, createAnalysisResult } from '@/utils/resultsPageHelpers';

const ANALYSIS_STORAGE_KEY = 'web_analysis_results';
const ANALYSIS_URL_KEY = 'web_analysis_url';

const ResultsPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('url');
    
    if (!urlParam) {
      setIsLoading(false);
      setError("URL não fornecido");
      return;
    }

    const storedUrl = localStorage.getItem(ANALYSIS_URL_KEY);
    const storedAnalysis = localStorage.getItem(ANALYSIS_STORAGE_KEY);
    
    if (storedUrl === urlParam && storedAnalysis) {
      try {
        console.log('Usando análise em cache para URL:', urlParam);
        const parsedAnalysis = JSON.parse(storedAnalysis) as AnalysisResult;
        setAnalysisData(parsedAnalysis);
        setIsLoading(false);
        toast('Usando análise em cache', {
          description: 'Mostrando resultados da análise anterior',
          duration: 3000
        });
        return;
      } catch (parseError) {
        console.error('Erro ao analisar dados em cache:', parseError);
      }
    }
    
    console.log('Iniciando nova análise para URL:', urlParam);
    setIsLoading(true);
    
    const performAnalysis = async () => {
      try {
        let normalizedUrl = urlParam;
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
          normalizedUrl = 'https://' + normalizedUrl;
          console.log('URL normalizada para:', normalizedUrl);
        }
        
        toast('Análise em andamento...', {
          description: 'Aguarde enquanto analisamos o site.',
          duration: 3000
        });
        
        let pageContent = '';
        try {
          console.log('Pular extração de conteúdo (requer backend)');
        } catch (contentError) {
          console.warn('Não foi possível extrair conteúdo:', contentError);
        }
        
        const [seoDataPromise, aioDataPromise] = await Promise.allSettled([
          (async () => {
            try {
              console.log('Iniciando análise SEO com Page Insights');
              const data = await getPageInsightsData(normalizedUrl);
              console.log('Dados SEO recebidos:', data);
              return data;
            } catch (error) {
              console.error('Error fetching Page Insights data:', error);
              toast.error('Erro na análise SEO', {
                description: 'Não foi possível conectar à API do Google Page Insights.',
              });
              
              return {
                score: 0,
                loadTimeDesktop: 0,
                loadTimeMobile: 0,
                mobileFriendly: false,
                imageOptimization: 0,
                headingsStructure: 0,
                metaTags: 0,
                security: false,
                issues: []
              };
            }
          })(),
          
          (async () => {
            try {
              console.log('Iniciando análise AIO com OpenAI');
              const data = await getChatGptAnalysis(normalizedUrl, pageContent);
              console.log('Dados AIO recebidos:', data);
              
              if (data && data.apiUsed) {
                console.log('API OpenAI foi utilizada com sucesso para análise');
              } else {
                console.log('API OpenAI não foi utilizada, usando analisador local');
              }
              
              return data;
            } catch (error) {
              console.error('Error fetching AIO data:', error);
              toast.error('Erro na análise AIO', {
                description: 'Não foi possível conectar à API de IA.',
              });
              
              return {
                score: 0,
                contentClarity: 0,
                logicalStructure: 0,
                naturalLanguage: 0,
                topicsDetected: [],
                confusingParts: []
              };
            }
          })()
        ]);
        
        const seoData = seoDataPromise.status === 'fulfilled' ? seoDataPromise.value : {
          score: 0,
          loadTimeDesktop: 0,
          loadTimeMobile: 0,
          mobileFriendly: false,
          imageOptimization: 0,
          headingsStructure: 0,
          metaTags: 0,
          security: false,
          issues: []
        };
        
        const aioData = aioDataPromise.status === 'fulfilled' ? aioDataPromise.value : {
          score: 0,
          contentClarity: 0,
          logicalStructure: 0,
          naturalLanguage: 0,
          topicsDetected: [],
          confusingParts: []
        };
        
        if (aioDataPromise.status === 'fulfilled' && aioData.apiUsed) {
          toast.success('Análise de IA concluída com sucesso', {
            description: 'A API OpenAI foi utilizada para analisar o site'
          });
        }
        
        const results = createAnalysisResult(normalizedUrl, seoData, aioData);
        console.log('Resultado da análise criado:', results);
        
        localStorage.setItem(ANALYSIS_URL_KEY, urlParam);
        localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(results));
        
        setAnalysisData(results);
      } catch (error) {
        console.error('Error performing analysis:', error);
        toast.error('Erro ao analisar site', {
          description: 'Não foi possível completar a análise do site.',
        });
        setError("Ocorreu um erro ao analisar o site");
      } finally {
        setIsLoading(false);
      }
    };
    
    performAnalysis();
  }, [location.search]);
  
  const handleReanalyze = () => {
    localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    localStorage.removeItem(ANALYSIS_URL_KEY);
    window.location.reload();
  };
  
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
  
  if (error || !analysisData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || "URL em falta"}</h1>
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
                seoScore={analysisData?.seo?.score || 0}
                aioScore={analysisData?.aio?.score || 0}
                status={analysisData?.overallStatus as any || 'Crítico'}
                url={formatUrl(analysisData?.url || '')}
              />
              
              <div className="flex justify-end">
                <button 
                  onClick={handleReanalyze}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Loader2 className="h-3 w-3" />
                  Analisar novamente
                </button>
              </div>
              
              <AnalysisTabs
                seoData={analysisData?.seo}
                aioData={analysisData?.aio}
                recommendations={analysisData?.recommendations || []}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ReportForm 
                url={analysisData?.url || ''} 
                seoScore={analysisData?.seo?.score || 0}
                aioScore={analysisData?.aio?.score || 0}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScoreDisplay from '@/components/ScoreDisplay';
import ReportForm from '@/components/ReportForm';
import EnhancedRecommendations from '@/components/EnhancedRecommendations';
import TechnicalHealthPanel from '@/components/TechnicalHealthPanel';
import AioAnalysisPanel from '@/components/AioAnalysisPanel';
import LLMPresenceAudit from '@/components/LLMPresenceAudit';
import { AnalysisResult } from '@/utils/api/types';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getPageInsightsData } from '@/utils/api';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { toast } from 'sonner';
import { formatUrl, createAnalysisResult } from '@/utils/resultsPageHelpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ANALYSIS_STORAGE_KEY = 'web_analysis_results';
const ANALYSIS_URL_KEY = 'web_analysis_url';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [aioError, setAioError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const recommendationsRef = useRef<HTMLDivElement>(null);
  
  const scrollToRecommendations = () => {
    recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
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
    setSeoError(null);
    setAioError(null);
    
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
        
        const seoDataPromise = (async () => {
          try {
            console.log('Iniciando análise SEO com Page Insights');
            return await getPageInsightsData(normalizedUrl);
          } catch (error) {
            setSeoError(error instanceof Error ? error.message : 'Erro desconhecido na análise SEO');
            console.error('Error fetching Page Insights data:', error);
            return null;
          }
        })();
        
        const aioDataPromise = (async () => {
          try {
            console.log('Iniciando análise AIO com OpenAI');
            return await getChatGptAnalysis(normalizedUrl);
          } catch (error) {
            setAioError(error instanceof Error ? error.message : 'Erro desconhecido na análise AIO');
            console.error('Error fetching AIO data:', error);
            return null;
          }
        })();
        
        const [seoData, aioData] = await Promise.all([seoDataPromise, aioDataPromise]);
        
        if (!seoData && !aioData) {
          setError('Falha em ambas as análises. Por favor, verifique suas configurações de API.');
          setIsLoading(false);
          return;
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
  
  const handleReturnHome = () => {
    navigate('/');
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
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Erro na Análise</h1>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Falha na análise</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <p className="mb-6">Verifique as configurações de API e tente novamente.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={handleReturnHome}>Voltar à página inicial</Button>
              <Button variant="outline" onClick={handleReanalyze}>Tentar novamente</Button>
            </div>
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
            <Button onClick={handleReturnHome}>Voltar à página inicial</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-8 md:px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in">
            Resultados da análise
          </h1>
          
          {(seoError || aioError) && (
            <Alert variant="warning" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Algumas análises falharam</AlertTitle>
              <AlertDescription className="space-y-2">
                {seoError && <p>Análise SEO: {seoError}</p>}
                {aioError && <p>Análise AIO: {aioError}</p>}
                <p>Os resultados mostrados podem estar incompletos.</p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <ScoreDisplay
                seoScore={analysisData?.seo?.score || 0}
                aioScore={analysisData?.aio?.score || 0}
                performanceScore={analysisData?.seo?.performanceScore || 65}
                llmPresenceScore={30}
                status={analysisData?.overallStatus as any || 'Crítico'}
                url={formatUrl(analysisData?.url || '')}
                logoUrl={analysisData?.logoUrl}
                onScrollToRecommendations={scrollToRecommendations}
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
              
              <Tabs defaultValue="analysis">
                <TabsList className="mb-4">
                  <TabsTrigger value="analysis">Análise Detalhada</TabsTrigger>
                  <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-6">
                  <TechnicalHealthPanel
                    loadTimeDesktop={analysisData.seo.loadTimeDesktop || 3.2}
                    loadTimeMobile={analysisData.seo.loadTimeMobile || 5.1}
                    mobileFriendly={analysisData.seo.mobileFriendly || false}
                    security={analysisData.seo.security || false}
                    imageOptimization={analysisData.seo.imageOptimization || 60}
                    performanceScore={analysisData.seo.performanceScore || 65}
                    lcp={analysisData.seo.lcp}
                    cls={analysisData.seo.cls}
                    fid={analysisData.seo.fid}
                  />
                  
                  <AioAnalysisPanel
                    aioScore={analysisData.aio.score}
                    contentClarity={analysisData.aio.contentClarity}
                    logicalStructure={analysisData.aio.logicalStructure}
                    naturalLanguage={analysisData.aio.naturalLanguage}
                    topicsDetected={analysisData.aio.topicsDetected || []}
                    confusingParts={analysisData.aio.confusingParts || []}
                  />
                  
                  <LLMPresenceAudit url={analysisData.url} autoStart={true} />
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <div ref={recommendationsRef}>
                    <EnhancedRecommendations recommendations={analysisData.recommendations || []} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {!isMobile && (
              <div className="lg:col-span-1">
                <ReportForm 
                  url={analysisData?.url || ''} 
                  seoScore={analysisData?.seo?.score || 0}
                  aioScore={analysisData?.aio?.score || 0}
                />
              </div>
            )}
          </div>
          
          {isMobile && (
            <div className="mt-6">
              <ReportForm 
                url={analysisData?.url || ''} 
                seoScore={analysisData?.seo?.score || 0}
                aioScore={analysisData?.aio?.score || 0}
                compact={true}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

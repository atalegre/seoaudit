
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AnalysisResult } from '@/utils/api/types';
import { getPageInsightsData } from '@/utils/api';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { toast } from 'sonner';
import { formatUrl, createAnalysisResult } from '@/utils/resultsPageHelpers';

// Import new components
import LoadingState from '@/components/results/LoadingState';
import ErrorState from '@/components/results/ErrorState';
import MissingUrlState from '@/components/results/MissingUrlState';
import ResultsContent from '@/components/results/ResultsContent';

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
  
  const handleReanalyze = () => {
    localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    localStorage.removeItem(ANALYSIS_URL_KEY);
    window.location.reload();
  };
  
  const handleReturnHome = () => {
    navigate('/');
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
  
  // Render appropriate component based on state
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <ErrorState 
        error={error} 
        onReturnHome={handleReturnHome} 
        onReanalyze={handleReanalyze} 
      />
    );
  }
  
  if (!analysisData) {
    return <MissingUrlState onReturnHome={handleReturnHome} />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-8 md:px-4">
        <ResultsContent
          analysisData={analysisData}
          seoError={seoError}
          aioError={aioError}
          onReanalyze={handleReanalyze}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

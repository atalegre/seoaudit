
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScoreDisplay from '@/components/ScoreDisplay';
import AnalysisTabs from '@/components/AnalysisTabs';
import ReportForm from '@/components/ReportForm';
import { analyzeSite, AnalysisResult } from '@/utils/analyzerUtils';
import { Loader2 } from 'lucide-react';

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
      return;
    }
    
    // Set up loading state and simulate API request
    setIsLoading(true);
    
    // Simulate delay for analysis process
    const timer = setTimeout(() => {
      // Call the analyzeSite function to get simulated results
      const results = analyzeSite(urlParam);
      setAnalysisData(results);
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location.search]);
  
  const formatUrl = (url: string) => {
    // Format URL for display (remove http://, https://)
    return url.replace(/^https?:\/\//, '');
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

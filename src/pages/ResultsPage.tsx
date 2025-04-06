
import React, { lazy, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAnalysis } from '@/hooks/useAnalysis';

// Import components lazily to improve initial load time
const LoadingState = lazy(() => import('@/components/results/LoadingState'));
const ErrorState = lazy(() => import('@/components/results/ErrorState'));
const MissingUrlState = lazy(() => import('@/components/results/MissingUrlState'));
const ResultsContent = lazy(() => import('@/components/results/ResultsContent'));

// Simple fallback for lazy components
const LazyFallback = () => (
  <div className="flex flex-col min-h-screen items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const urlParam = params.get('url');
  
  const { 
    isLoading, 
    analysisData, 
    error, 
    seoError, 
    aioError, 
    handleReanalyze 
  } = useAnalysis(urlParam);
  
  // Função para melhorar o FCP/LCP - preparar a interface antecipadamente
  useEffect(() => {
    // Preload crítico de componentes que serão usados
    const componentPaths = [
      '@/components/results/LoadingState',
      '@/components/results/ResultsContent'
    ];
    
    // Usando dynamic import para preload
    componentPaths.forEach(path => {
      import(/* @vite-ignore */ path).catch(e => {
        console.warn(`Failed to preload ${path}:`, e);
      });
    });
    
    // Reportar métricas de carregamento
    if ('performance' in window) {
      try {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          console.log(`Navigation Time: ${Math.round(navEntry.duration)}ms`);
        }
      } catch (e) {
        console.warn('Error measuring navigation performance:', e);
      }
    }
  }, []);
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-8 md:px-4">
        <Suspense fallback={<LazyFallback />}>
          {isLoading && <LoadingState />}
          
          {!isLoading && error && (
            <ErrorState 
              error={error} 
              onReturnHome={handleReturnHome} 
              onReanalyze={handleReanalyze} 
            />
          )}
          
          {!isLoading && !error && !analysisData && (
            <MissingUrlState onReturnHome={handleReturnHome} />
          )}
          
          {!isLoading && !error && analysisData && (
            <ResultsContent
              analysisData={analysisData}
              seoError={seoError}
              aioError={aioError}
              onReanalyze={handleReanalyze}
            />
          )}
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

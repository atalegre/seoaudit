
import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAnalysis } from '@/hooks/useAnalysis';

// Definir constantes para otimização
const PRECONNECT_DOMAINS = [
  'https://logo.clearbit.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

// Componentes críticos - importados diretamente
import LoadingState from '@/components/results/LoadingState';

// Componentes não críticos - lazy loading otimizado
const ErrorState = lazy(() => import('@/components/results/ErrorState'));
const MissingUrlState = lazy(() => import('@/components/results/MissingUrlState'));
const ResultsContent = lazy(() => import('@/components/results/ResultsContent'));

// Fallback simples e leve para não criar layout shifts
const LazyFallback = () => (
  <div className="flex flex-col min-h-screen items-center justify-center p-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
  
  // Prefetch de recursos críticos - executado uma vez
  useEffect(() => {
    // Estabelecer conexões para domínios críticos
    PRECONNECT_DOMAINS.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Prefetch de componentes críticos
    const prefetchComponents = () => {
      import('@/components/results/LoadingState');
      import('@/components/ScoreDisplay');
      
      // Iniciar carregamento não-crítico apenas após renderização principal
      setTimeout(() => {
        import('@/components/results/ResultsContent');
        import('@/components/AnalysisTabs');
      }, 1000);
    };
    
    // Executar em IdleCallback se disponível
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchComponents);
    } else {
      setTimeout(prefetchComponents, 500);
    }
    
    // Otimização de LCP metrics
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            console.log(`ResultsPage LCP: ${entry.startTime}ms`);
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP observation failed:', e);
      }
    }
  }, []);
  
  // Memoizar função para evitar recriação
  const handleReturnHome = useCallback(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-8 md:px-4">
        {/* LoadingState renderizado diretamente - não é lazy */}
        {isLoading && <LoadingState />}
        
        {/* Estados de erro e conteúdo principal com lazy loading */}
        {!isLoading && (
          <>
            {error && (
              <Suspense fallback={<LazyFallback />}>
                <ErrorState 
                  error={error} 
                  onReturnHome={handleReturnHome} 
                  onReanalyze={handleReanalyze} 
                />
              </Suspense>
            )}
            
            {!error && !analysisData && (
              <Suspense fallback={<LazyFallback />}>
                <MissingUrlState onReturnHome={handleReturnHome} />
              </Suspense>
            )}
            
            {!error && analysisData && (
              <Suspense fallback={<LoadingState />}>
                <ResultsContent
                  analysisData={analysisData}
                  seoError={seoError}
                  aioError={aioError}
                  onReanalyze={handleReanalyze}
                />
              </Suspense>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

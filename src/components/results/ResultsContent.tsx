
import React, { useRef, Suspense, lazy, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ScoreDisplay from '@/components/ScoreDisplay';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { AnalysisResult } from '@/utils/api/types';
import ReanalyzeButton from './ReanalyzeButton';
import PartialDataAlert from './PartialDataAlert';
import { LazyLoadingFallback } from './LazyComponents';

// Lazy load não-crítico com prefetch para componentes principais
const ReportForm = lazy(() => {
  // Prefetch ReportForm para melhorar responsividade 
  const prefetchPromise = import('@/components/report/ReportForm');
  return prefetchPromise;
});

// Fix: properly convert named export to default export for lazy loading
const AnalysisTabs = lazy(() => 
  import('@/components/AnalysisTabs').then(module => ({ 
    default: module.AnalysisTabs 
  }))
);

interface AnalysisContentProps {
  analysisData: AnalysisResult;
  seoError: string | null;
  aioError: string | null;
  onReanalyze: () => void;
}

const ResultsContent: React.FC<AnalysisContentProps> = ({
  analysisData,
  seoError,
  aioError,
  onReanalyze
}) => {
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const hasSeoData = analysisData?.seo?.score > 0;
  const hasAioData = analysisData?.aio?.score > 0;
  const seoHasError = analysisData?.seo?.isError === true;
  
  // Prefetch components on mount para melhorar desempenho percebido
  useEffect(() => {
    const prefetchComponents = async () => {
      // Prefetch em paralelo usando Promise.all
      if (hasSeoData || hasAioData) {
        const prefetchPromises = [
          import('@/components/AnalysisTabs'),
          import('@/components/report/ReportForm')
        ];
        
        try {
          // Não aguardar para não bloquear renderização
          Promise.all(prefetchPromises);
        } catch (e) {
          console.warn('Prefetch error:', e);
        }
      }
    };
    
    // Usar setTimeout para dar prioridade ao LCP
    setTimeout(prefetchComponents, 1000);
  }, [hasSeoData, hasAioData]);
  
  const scrollToRecommendations = () => {
    recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      <PartialDataAlert 
        seoError={seoError} 
        aioError={aioError} 
        seoHasError={seoHasError} 
        seoErrorMessage={analysisData?.seo?.errorMessage}
      />
      
      {/* Conteúdo prioritário - Alvo LCP otimizado com loading priority */}
      <div className="lcp-block" style={{ contain: 'layout' }}>
        <ScoreDisplay
          seoScore={analysisData?.seo?.score || 0}
          aioScore={analysisData?.aio?.score || 0}
          performanceScore={analysisData?.seo?.performanceScore || 0}
          llmPresenceScore={0}
          status={analysisData?.overallStatus as any || 'Crítico'}
          url={formatUrl(analysisData?.url || '')}
          logoUrl={analysisData?.logoUrl}
          onScrollToRecommendations={scrollToRecommendations}
        />
      </div>
      
      <ReanalyzeButton onReanalyze={onReanalyze} />
      
      {/* Conteúdo não crítico - carregar após LCP com display content-visibility */}
      <div className="space-y-6 mt-8" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
        {(hasSeoData || hasAioData) && (
          <Suspense fallback={<LazyLoadingFallback />}>
            <AnalysisTabs 
              data={analysisData} 
              seoError={seoError}
              aioError={aioError}
            />
          </Suspense>
        )}
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Relatório Completo</h2>
          <p className="text-gray-600 mb-6">
            Para aceder ao relatório completo com análises detalhadas, recomendações personalizadas
            e insights sobre SEO e otimização de conteúdo, registe-se na nossa plataforma.
          </p>
          
          <Suspense fallback={<LazyLoadingFallback />}>
            <ReportForm 
              url={analysisData?.url || ''} 
              seoScore={analysisData?.seo?.score || 0}
              aioScore={analysisData?.aio?.score || 0}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default React.memo(ResultsContent);


import React, { useRef, Suspense, lazy } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ScoreDisplay from '@/components/ScoreDisplay';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { AnalysisResult } from '@/utils/api/types';
import ReanalyzeButton from './ReanalyzeButton';
import PartialDataAlert from './PartialDataAlert';
import { LazyLoadingFallback } from './LazyComponents';

// Lazy load forms and non-critical components
const ReportForm = lazy(() => import('@/components/report/ReportForm'));
// Fix: import AnalysisTabs directly to ensure it has a default export
const AnalysisTabs = lazy(() => import('@/components/AnalysisTabs').then(module => ({ default: module.AnalysisTabs })));

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
      
      {/* Conteúdo prioritário - Alvo LCP */}
      <div className="lcp-block">
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
      
      {/* Conteúdo não crítico - carregar após LCP */}
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


import React, { useRef, Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ScoreDisplay from '@/components/ScoreDisplay';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { AnalysisResult } from '@/utils/api/types';
import ReanalyzeButton from './ReanalyzeButton';
import PartialDataAlert from './PartialDataAlert';
import { LazyLoadingFallback } from './LazyComponents';
import ReportForm from '@/components/report/ReportForm';

// Lazy loaded components
const EnhancedRecommendations = React.lazy(() => 
  import('@/components/EnhancedRecommendations')
);

const TechnicalHealthPanel = React.lazy(() => 
  import('@/components/TechnicalHealthPanel')
);

const AioAnalysisPanel = React.lazy(() => 
  import('@/components/AioAnalysisPanel')
);

interface AnalysisContentProps {
  analysisData: AnalysisResult;
  seoError: string | null;
  aioError: string | null;
  onReanalyze: () => void;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({
  analysisData,
  seoError,
  aioError,
  onReanalyze
}) => {
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const hasSeoData = analysisData?.seo?.score > 0;
  const hasAioData = analysisData?.aio?.score > 0;
  const seoHasError = analysisData?.seo?.isError === true;
  
  // Log mais detalhado para depuração
  console.log('AnalysisContent - Dados completos:', analysisData);
  console.log('AnalysisContent - Logo URL:', analysisData?.logoUrl);
  
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
      
      <ReanalyzeButton onReanalyze={onReanalyze} />
      
      <div className="space-y-6 mt-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Relatório Completo</h2>
          <p className="text-gray-600 mb-6">
            Para aceder ao relatório completo com análises detalhadas, recomendações personalizadas
            e insights sobre SEO e otimização de conteúdo, registe-se na nossa plataforma.
          </p>
          
          <ReportForm 
            url={analysisData?.url || ''} 
            seoScore={analysisData?.seo?.score || 0}
            aioScore={analysisData?.aio?.score || 0}
          />
        </div>
      </div>
    </>
  );
};

export default AnalysisContent;

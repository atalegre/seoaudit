
import React, { useRef, Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ScoreDisplay from '@/components/ScoreDisplay';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { AnalysisResult } from '@/utils/api/types';
import ReanalyzeButton from './ReanalyzeButton';
import PartialDataAlert from './PartialDataAlert';
import { LazyLoadingFallback } from './LazyComponents';

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
  
  // Para debug - verificar se temos a URL do logo
  console.log('Logo URL from analysis data:', analysisData?.logoUrl);
  
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
      
      <div className="space-y-6">
        {hasSeoData ? (
          <Suspense fallback={<LazyLoadingFallback />}>
            <TechnicalHealthPanel
              loadTimeDesktop={analysisData.seo.loadTimeDesktop}
              loadTimeMobile={analysisData.seo.loadTimeMobile}
              mobileFriendly={analysisData.seo.mobileFriendly}
              security={analysisData.seo.security}
              imageOptimization={analysisData.seo.imageOptimization}
              performanceScore={analysisData.seo.performanceScore}
              lcp={analysisData.seo.lcp}
              cls={analysisData.seo.cls}
              fid={analysisData.seo.fid}
            />
          </Suspense>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dados SEO não disponíveis</AlertTitle>
            <AlertDescription>
              {seoError || analysisData?.seo?.errorMessage || "Não foi possível obter dados SEO reais. Configure uma chave API válida nas Configurações."}
            </AlertDescription>
          </Alert>
        )}
        
        {hasAioData ? (
          <Suspense fallback={<LazyLoadingFallback />}>
            <AioAnalysisPanel
              aioScore={analysisData.aio.score}
              contentClarity={analysisData.aio.contentClarity}
              logicalStructure={analysisData.aio.logicalStructure}
              naturalLanguage={analysisData.aio.naturalLanguage}
              topicsDetected={analysisData.aio.topicsDetected || []}
              confusingParts={analysisData.aio.confusingParts || []}
            />
          </Suspense>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dados AIO não disponíveis</AlertTitle>
            <AlertDescription>
              {aioError || "Não foi possível obter dados AIO reais. Configure uma chave API OpenAI válida."}
            </AlertDescription>
          </Alert>
        )}
        
        {analysisData.recommendations && analysisData.recommendations.length > 0 ? (
          <div ref={recommendationsRef} id="recommendations" className="pt-4 scroll-mt-16">
            <Suspense fallback={<LazyLoadingFallback />}>
              <EnhancedRecommendations recommendations={analysisData.recommendations || []} />
            </Suspense>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sem recomendações disponíveis</AlertTitle>
            <AlertDescription>
              Não foi possível obter recomendações baseadas em dados reais.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};

export default AnalysisContent;

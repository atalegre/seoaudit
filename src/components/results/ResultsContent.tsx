
import React, { useRef } from 'react';
import ScoreDisplay from '@/components/ScoreDisplay';
import { formatUrl } from '@/utils/resultsPageHelpers';
import ReanalyzeButton from './ReanalyzeButton';
import PartialDataAlert from './PartialDataAlert';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ResultsContent = ({ 
  analysisData, 
  seoError, 
  aioError, 
  onReanalyze 
}) => {
  const recommendationsRef = useRef(null);
  const hasSeoData = analysisData?.seo?.score > 0;
  const hasAioData = analysisData?.aio?.score > 0;
  const seoHasError = analysisData?.seo?.isError === true;
  
  const scrollToRecommendations = () => {
    recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Verificar se temos dados válidos para exibir
  const hasValidData = hasSeoData || hasAioData;
  
  return (
    <>
      {/* Mensagem para quando não temos dados válidos */}
      {!hasValidData && !isLoading && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dados não disponíveis</AlertTitle>
          <AlertDescription>
            Não foi possível obter dados reais para esta análise. 
            Por favor, tente novamente ou verifique se as APIs estão configuradas corretamente.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Critical LCP content - optimized for performance */}
      {hasValidData && (
        <div className="lcp-critical">
          <ScoreDisplay
            seoScore={analysisData?.seo?.score || 0}
            aioScore={analysisData?.aio?.score || 0}
            performanceScore={analysisData?.seo?.performanceScore || 0}
            llmPresenceScore={0}
            status={analysisData?.overallStatus || 'Crítico'}
            url={formatUrl(analysisData?.url || '')}
            logoUrl={analysisData?.logoUrl}
            onScrollToRecommendations={scrollToRecommendations}
          />
        </div>
      )}
      
      <ReanalyzeButton onReanalyze={onReanalyze} />
      
      {/* Secondary content - loaded after critical path */}
      {(seoError || aioError || seoHasError) && (
        <div id="non-critical-alerts" className="mt-4">
          <PartialDataAlert 
            seoError={seoError} 
            aioError={aioError} 
            seoHasError={seoHasError} 
            seoErrorMessage={analysisData?.seo?.errorMessage}
          />
        </div>
      )}
      
      {/* Deferred content container */}
      <div id="deferred-content"></div>
    </>
  );
};

export default ResultsContent;

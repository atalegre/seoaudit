
import React, { useRef } from 'react';
import ScoreDisplay from '@/components/ScoreDisplay';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { AnalysisResult } from '@/utils/api/types';
import ReanalyzeButton from './ReanalyzeButton';
import PartialDataAlert from './PartialDataAlert';

// Componente crítico - ultraotimizado
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
  
  return (
    <>
      {/* Conteúdo prioritário para LCP - sem overhead */}
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
      
      <ReanalyzeButton onReanalyze={onReanalyze} />
      
      {/* Alerta de erro - carregamento secundário */}
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
      
      {/* Lazy load do restante do conteúdo */}
      <div id="deferred-content"></div>
    </>
  );
};

export default ResultsContent;

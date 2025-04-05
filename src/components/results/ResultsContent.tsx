
import React from 'react';
import { AnalysisResult } from '@/utils/api/types';
import { useIsMobile } from '@/hooks/use-mobile';
import AnalysisErrorView from './AnalysisErrorView';
import AnalysisContent from './AnalysisContent';
import AnalysisSidebar from './AnalysisSidebar';

interface ResultsContentProps {
  analysisData: AnalysisResult;
  seoError: string | null;
  aioError: string | null;
  onReanalyze: () => void;
}

const ResultsContent: React.FC<ResultsContentProps> = ({ 
  analysisData, 
  seoError, 
  aioError, 
  onReanalyze 
}) => {
  const isMobile = useIsMobile();
  
  const hasSeoData = analysisData?.seo?.score > 0;
  const hasAioData = analysisData?.aio?.score > 0;
  
  if (!hasSeoData && !hasAioData) {
    return <AnalysisErrorView 
      seoError={seoError} 
      aioError={aioError} 
      onReanalyze={onReanalyze} 
    />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in lcp-target">
        Resultados da análise
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <AnalysisContent 
            analysisData={analysisData}
            seoError={seoError}
            aioError={aioError}
            onReanalyze={onReanalyze}
          />
        </div>
        
        <div className={`lg:col-span-1 ${isMobile ? 'mt-6' : ''}`}>
          <AnalysisSidebar 
            url={analysisData?.url || ''} 
            seoScore={analysisData?.seo?.score || 0}
            aioScore={analysisData?.aio?.score || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsContent;


import React, { useRef } from 'react';
import { AnalysisResult } from '@/utils/api/types';
import { AlertCircle, Loader2 } from 'lucide-react';
import ScoreDisplay from '@/components/ScoreDisplay';
import ReportForm from '@/components/ReportForm';
import EnhancedRecommendations from '@/components/EnhancedRecommendations';
import TechnicalHealthPanel from '@/components/TechnicalHealthPanel';
import AioAnalysisPanel from '@/components/AioAnalysisPanel';
import LLMPresenceAudit from '@/components/LLMPresenceAudit';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const recommendationsRef = useRef<HTMLDivElement>(null);
  
  const scrollToRecommendations = () => {
    recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in">
        Resultados da análise
      </h1>
      
      {(seoError || aioError) && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Algumas análises falharam</AlertTitle>
          <AlertDescription className="space-y-2">
            {seoError && <p>Análise SEO: {seoError}</p>}
            {aioError && <p>Análise AIO: {aioError}</p>}
            <p>Os resultados mostrados podem estar incompletos.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <ScoreDisplay
            seoScore={analysisData?.seo?.score || 0}
            aioScore={analysisData?.aio?.score || 0}
            performanceScore={analysisData?.seo?.performanceScore || 65}
            llmPresenceScore={30}
            status={analysisData?.overallStatus as any || 'Crítico'}
            url={formatUrl(analysisData?.url || '')}
            logoUrl={analysisData?.logoUrl}
            onScrollToRecommendations={scrollToRecommendations}
          />
          
          <div className="flex justify-end">
            <button 
              onClick={onReanalyze}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Loader2 className="h-3 w-3" />
              Analisar novamente
            </button>
          </div>
          
          <Tabs defaultValue="analysis">
            <TabsList className="mb-4">
              <TabsTrigger value="analysis">Análise Detalhada</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-6">
              <TechnicalHealthPanel
                loadTimeDesktop={analysisData.seo.loadTimeDesktop || 3.2}
                loadTimeMobile={analysisData.seo.loadTimeMobile || 5.1}
                mobileFriendly={analysisData.seo.mobileFriendly || false}
                security={analysisData.seo.security || false}
                imageOptimization={analysisData.seo.imageOptimization || 60}
                performanceScore={analysisData.seo.performanceScore || 65}
                lcp={analysisData.seo.lcp}
                cls={analysisData.seo.cls}
                fid={analysisData.seo.fid}
              />
              
              <AioAnalysisPanel
                aioScore={analysisData.aio.score}
                contentClarity={analysisData.aio.contentClarity}
                logicalStructure={analysisData.aio.logicalStructure}
                naturalLanguage={analysisData.aio.naturalLanguage}
                topicsDetected={analysisData.aio.topicsDetected || []}
                confusingParts={analysisData.aio.confusingParts || []}
              />
              
              <LLMPresenceAudit url={analysisData.url} autoStart={true} />
            </TabsContent>
            
            <TabsContent value="recommendations">
              <div ref={recommendationsRef}>
                <EnhancedRecommendations recommendations={analysisData.recommendations || []} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {!isMobile && (
          <div className="lg:col-span-1">
            <ReportForm 
              url={analysisData?.url || ''} 
              seoScore={analysisData?.seo?.score || 0}
              aioScore={analysisData?.aio?.score || 0}
            />
          </div>
        )}
      </div>
      
      {isMobile && (
        <div className="mt-6">
          <ReportForm 
            url={analysisData?.url || ''} 
            seoScore={analysisData?.seo?.score || 0}
            aioScore={analysisData?.aio?.score || 0}
            compact={true}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsContent;

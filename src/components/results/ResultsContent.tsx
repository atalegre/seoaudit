
import React, { useRef, lazy, Suspense } from 'react';
import { AnalysisResult } from '@/utils/api/types';
import { AlertCircle, Loader2, FileText, AlertTriangle } from 'lucide-react';
import ScoreDisplay from '@/components/ScoreDisplay';
import ReportForm from '@/components/ReportForm';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnhancedRecommendations = lazy(() => 
  import('@/components/EnhancedRecommendations')
);

const TechnicalHealthPanel = lazy(() => 
  import('@/components/TechnicalHealthPanel')
);

const AioAnalysisPanel = lazy(() => 
  import('@/components/AioAnalysisPanel')
);

const LLMPresenceAudit = lazy(() => 
  import('@/components/LLMPresenceAudit')
);

const LocalDirectoryPresence = lazy(() =>
  import('@/components/LocalDirectoryPresence')
);

const LazyLoadingFallback = () => (
  <div className="flex justify-center items-center h-32 w-full">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

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

  const hasSeoData = analysisData?.seo?.score > 0;
  
  const hasAioData = analysisData?.aio?.score > 0;
  
  const seoHasError = analysisData?.seo?.isError === true;
  
  // Para debug - verificar se temos a URL do logo
  console.log('Logo URL from analysis data:', analysisData?.logoUrl);
  
  if (!hasSeoData && !hasAioData) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in lcp-target">
          Resultados da análise
        </h1>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Não foi possível obter dados reais</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Não conseguimos obter dados reais das APIs para a análise.</p>
            {seoError && <p><strong>Erro SEO:</strong> {seoError}</p>}
            {aioError && <p><strong>Erro AIO:</strong> {aioError}</p>}
            <p>Por favor, verifique se as chaves de API estão configuradas corretamente nas Configurações.</p>
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-8">
          <button 
            onClick={onReanalyze}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Loader2 className="h-4 w-4 mr-2 inline" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in lcp-target">
        Resultados da análise
      </h1>
      
      {(seoError || aioError || seoHasError) && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dados parciais disponíveis</AlertTitle>
          <AlertDescription className="space-y-2">
            {seoError && <p><strong>Análise SEO:</strong> {seoError}</p>}
            {seoHasError && <p><strong>Análise SEO:</strong> {analysisData?.seo?.errorMessage || "Erro ao obter dados SEO"}</p>}
            {aioError && <p><strong>Análise AIO:</strong> {aioError}</p>}
            <p>Os resultados mostrados são baseados apenas nos dados que pudemos obter.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
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
          
          <div className="flex justify-end">
            <button 
              onClick={onReanalyze}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Loader2 className="h-3 w-3" />
              Analisar novamente
            </button>
          </div>
          
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
        </div>
        
        <div className={`lg:col-span-1 ${isMobile ? 'mt-6' : ''}`}>
          <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Já sabe o que pode melhorar?</h3>
            <p className="text-gray-600 mb-6">A nossa equipa de especialistas pode ajudar a implementar estas melhorias e elevar a presença digital do seu negócio.</p>
            
            <ReportForm 
              url={analysisData?.url || ''} 
              seoScore={analysisData?.seo?.score || 0}
              aioScore={analysisData?.aio?.score || 0}
              compact={isMobile}
            />
            
            <div className="mt-6 pt-4 border-t">
              <button 
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  alert("Funcionalidade de exportar PDF em desenvolvimento");
                }}
              >
                <FileText className="h-4 w-4" />
                <span>Exportar PDF do relatório</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContent;

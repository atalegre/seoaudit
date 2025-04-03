
import React, { useRef, lazy, Suspense } from 'react';
import { AnalysisResult } from '@/utils/api/types';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import ScoreDisplay from '@/components/ScoreDisplay';
import ReportForm from '@/components/ReportForm';
import { formatUrl } from '@/utils/resultsPageHelpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Componentes carregados com lazy loading
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

// Componente de fallback para carregamentos lazy
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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in lcp-target">
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
          {/* 1. 🧠 Resumo Geral no Topo */}
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
          
          {/* Blocos de análise estruturados */}
          <div className="space-y-6">
            {/* 2. 📊 Bloco 1 - SEO Técnico e Performance */}
            <Suspense fallback={<LazyLoadingFallback />}>
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
            </Suspense>
            
            {/* 3. 🤖 Bloco 2 - Clareza para Inteligência Artificial */}
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
            
            {/* 4. 🌍 Bloco 3 - Presença Local e IA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Suspense fallback={<LazyLoadingFallback />}>
                <LLMPresenceAudit url={analysisData.url} autoStart={false} />
              </Suspense>
              
              <Suspense fallback={<LazyLoadingFallback />}>
                <LocalDirectoryPresence 
                  url={analysisData.url} 
                  companyName={analysisData.seo.companyName} 
                />
              </Suspense>
            </div>
            
            {/* 5. 🔧 Bloco 4 - Recomendações com impacto */}
            <div ref={recommendationsRef} id="recommendations" className="pt-4 scroll-mt-16">
              <Suspense fallback={<LazyLoadingFallback />}>
                <EnhancedRecommendations recommendations={analysisData.recommendations || []} />
              </Suspense>
            </div>
          </div>
        </div>
        
        {/* 7. 📩 Call-to-Action final */}
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
                  // Simular clique em "Exportar PDF" - futura implementação
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

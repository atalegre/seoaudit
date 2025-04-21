
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import DevicePerformancePanel from './DevicePerformancePanel';
import OpportunitiesPanel from './OpportunitiesPanel';
import TechnicalAuditsPanel from './TechnicalAuditsPanel';
import CoreWebVitalsPanel from './CoreWebVitalsPanel';
import AnalysisErrorView from '@/components/results/AnalysisErrorView';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { safeGet } from '@/utils/dataChecks';

interface DeviceTabsSectionProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  desktopData: any;
  mobileData: any;
  isAnalyzing: boolean;
  error: string | null;
}

const DeviceTabsSection: React.FC<DeviceTabsSectionProps> = ({
  activeTab,
  setActiveTab,
  desktopData,
  mobileData,
  isAnalyzing,
  error
}) => {
  const isMobile = useIsMobile();
  
  // Automatically switch to mobile tab if desktop isn't available
  useEffect(() => {
    if (!desktopData && mobileData && activeTab === 'desktop') {
      setActiveTab('mobile');
      toast.info("Mostrando dados mobile", {
        description: "A análise desktop falhou, mostrando resultados mobile."
      });
    }
  }, [desktopData, mobileData, activeTab, setActiveTab]);

  const handleRetry = () => {
    // Limpar cache do sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('psi_')) {
        sessionStorage.removeItem(key);
      }
    });
    
    toast.info("Limpando cache e reiniciando análise", {
      description: "Tentando obter dados atualizados da API"
    });
    
    // Recarregar a página para forçar uma nova análise
    window.location.reload();
  };

  // Check if we have any valid data
  const hasDesktopData = desktopData && !isAnalyzing;
  const hasMobileData = mobileData && !isAnalyzing;
  const hasAnyData = hasDesktopData || hasMobileData;
  
  if (error && !hasAnyData) {
    // Se temos um erro e nenhum dado válido, mostrar a tela de erro
    return (
      <AnalysisErrorView 
        seoError={error}
        aioError={null}
        onReanalyze={handleRetry}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b px-2 md:px-4">
            <TabsList className="bg-transparent h-12 md:h-14 w-full">
              <TabsTrigger 
                value="desktop" 
                className="data-[state=active]:bg-muted flex items-center gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm"
                disabled={isAnalyzing || !hasDesktopData}
              >
                <Monitor className="h-3 w-3 md:h-4 md:w-4" />
                <span>Desktop</span>
                {!hasDesktopData && hasMobileData && (
                  <span className="ml-1 text-xs text-red-500">(Falha)</span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="mobile" 
                className="data-[state=active]:bg-muted flex items-center gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm"
                disabled={isAnalyzing || !hasMobileData}
              >
                <Smartphone className="h-3 w-3 md:h-4 md:w-4" />
                <span>Mobile</span>
                {!hasMobileData && hasDesktopData && (
                  <span className="ml-1 text-xs text-red-500">(Falha)</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          {error && hasAnyData && (
            <div className="p-3 md:p-4 bg-amber-50 text-amber-800 border-b border-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs md:text-sm">
                <p className="font-medium">Aviso: Dados parciais disponíveis</p>
                <p className="text-xs">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="text-xs mt-1 text-blue-600 hover:text-blue-800 underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}
          
          <TabsContent value="desktop" className="m-0">
            {hasDesktopData && (
              <div className="p-3 md:p-4 space-y-4 md:space-y-6">
                <DevicePerformancePanel data={desktopData} deviceType="desktop" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <CoreWebVitalsPanel 
                    lcp={safeGet(desktopData, 'lcp', 0)} 
                    cls={safeGet(desktopData, 'cls', 0)} 
                    fid={safeGet(desktopData, 'fid', 0)} 
                  />
                  <OpportunitiesPanel opportunities={safeGet(desktopData, 'recommendations', [])} />
                </div>
                
                <TechnicalAuditsPanel data={desktopData} />
              </div>
            )}
            
            {!hasDesktopData && (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">
                  {isAnalyzing ? "Analisando dados desktop..." : "Dados desktop não disponíveis."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="mobile" className="m-0">
            {hasMobileData && (
              <div className="p-3 md:p-4 space-y-4 md:space-y-6">
                <DevicePerformancePanel data={mobileData} deviceType="mobile" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <CoreWebVitalsPanel 
                    lcp={safeGet(mobileData, 'lcp', 0)} 
                    cls={safeGet(mobileData, 'cls', 0)} 
                    fid={safeGet(mobileData, 'fid', 0)} 
                  />
                  <OpportunitiesPanel opportunities={safeGet(mobileData, 'recommendations', [])} />
                </div>
                
                <TechnicalAuditsPanel data={mobileData} />
              </div>
            )}
            
            {!hasMobileData && (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">
                  {isAnalyzing ? "Analisando dados mobile..." : "Dados mobile não disponíveis."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeviceTabsSection;

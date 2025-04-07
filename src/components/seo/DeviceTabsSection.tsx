
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Loader2, AlertTriangle } from 'lucide-react';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';
import DevicePerformancePanel from '@/components/seo/DevicePerformancePanel';
import CoreWebVitalsPanel from '@/components/seo/CoreWebVitalsPanel';
import TechnicalAuditsPanel from '@/components/seo/TechnicalAuditsPanel';
import OpportunitiesPanel from '@/components/seo/OpportunitiesPanel';

interface DeviceTabsSectionProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  desktopData: PageInsightsData | null;
  mobileData: PageInsightsData | null;
  isAnalyzing: boolean;
}

const DeviceTabsSection: React.FC<DeviceTabsSectionProps> = ({
  activeTab,
  setActiveTab,
  desktopData,
  mobileData,
  isAnalyzing
}) => {
  if (!desktopData && !mobileData && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-muted rounded-lg">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma análise realizada</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          Insira uma URL acima e clique em Analisar para obter dados detalhados de performance
          e SEO técnico do seu site.
        </p>
      </div>
    );
  }

  if (!desktopData && !mobileData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="space-y-6">
          {desktopData ? (
            <>
              <DevicePerformancePanel 
                data={desktopData} 
                deviceType="desktop" 
              />
              <CoreWebVitalsPanel 
                lcp={desktopData.lcp} 
                cls={desktopData.cls} 
                fid={desktopData.fid} 
              />
              <TechnicalAuditsPanel 
                mobileFriendly={desktopData.mobileFriendly}
                security={desktopData.security}
                headingsStructure={desktopData.headingsStructure}
                metaTags={desktopData.metaTags}
              />
              <OpportunitiesPanel recommendations={desktopData.recommendations || []} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium">Carregando dados do desktop...</h3>
            </div>
          )}
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          {mobileData ? (
            <>
              <DevicePerformancePanel 
                data={mobileData} 
                deviceType="mobile" 
              />
              <CoreWebVitalsPanel 
                lcp={mobileData.lcp} 
                cls={mobileData.cls} 
                fid={mobileData.fid} 
              />
              <TechnicalAuditsPanel 
                mobileFriendly={mobileData.mobileFriendly}
                security={mobileData.security}
                headingsStructure={mobileData.headingsStructure}
                metaTags={mobileData.metaTags}
              />
              <OpportunitiesPanel recommendations={mobileData.recommendations || []} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium">Carregando dados do mobile...</h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceTabsSection;

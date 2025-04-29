
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Monitor, Loader2 } from 'lucide-react';
import CoreWebVitalsPanel from './CoreWebVitalsPanel';
import TechnicalAuditsPanel from './TechnicalAuditsPanel';
import OpportunitiesPanel from './OpportunitiesPanel';

interface DeviceTabsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  desktopData: any;
  mobileData: any;
  isAnalyzing: boolean;
  error: string | null;
}

const DeviceTabsSection = ({
  activeTab,
  setActiveTab,
  desktopData,
  mobileData,
  isAnalyzing,
  error
}: DeviceTabsSectionProps) => {
  // Enhanced logging for debugging
  console.log('DeviceTabsSection - desktopData:', desktopData);
  console.log('DeviceTabsSection - mobileData:', mobileData);
  
  // Get current data based on active tab
  const currentData = activeTab === 'desktop' ? desktopData : mobileData;
  
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">Resultados da Análise</h3>
          <TabsList className="grid grid-cols-2 w-auto">
            <TabsTrigger value="desktop" className="flex items-center gap-2 px-3">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2 px-3">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="desktop" className="m-0">
          {isAnalyzing && !desktopData && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Analisando em Desktop...</p>
            </div>
          )}
          
          {!isAnalyzing && error && !desktopData && (
            <div className="p-4 text-center">
              <p className="text-destructive">Erro na análise Desktop: {error}</p>
            </div>
          )}
          
          {desktopData && (
            <div className="p-6 space-y-6">
              <CoreWebVitalsPanel 
                lcp={desktopData.lcp || 0}
                cls={desktopData.cls || 0}
                fid={desktopData.fid || 0}
              />
              
              <TechnicalAuditsPanel 
                data={{
                  mobileFriendly: desktopData.mobileFriendly || false,
                  security: {
                    https: desktopData.security?.https || false,
                    mixedContent: desktopData.security?.mixedContent || false
                  },
                  headingsStructure: desktopData.headingsStructure || {},
                  metaTags: desktopData.metaTags || {}
                }}
              />
              
              <OpportunitiesPanel 
                opportunities={desktopData.recommendations || []}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="mobile" className="m-0">
          {isAnalyzing && !mobileData && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Analisando em Mobile...</p>
            </div>
          )}
          
          {!isAnalyzing && error && !mobileData && (
            <div className="p-4 text-center">
              <p className="text-destructive">Erro na análise Mobile: {error}</p>
            </div>
          )}
          
          {mobileData && (
            <div className="p-6 space-y-6">
              <CoreWebVitalsPanel 
                lcp={mobileData.lcp || 0}
                cls={mobileData.cls || 0}
                fid={mobileData.fid || 0}
              />
              
              <TechnicalAuditsPanel 
                data={{
                  mobileFriendly: mobileData.mobileFriendly || false,
                  security: {
                    https: mobileData.security?.https || false,
                    mixedContent: mobileData.security?.mixedContent || false
                  },
                  headingsStructure: mobileData.headingsStructure || {},
                  metaTags: mobileData.metaTags || {}
                }}
              />
              
              <OpportunitiesPanel 
                opportunities={mobileData.recommendations || []}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceTabsSection;

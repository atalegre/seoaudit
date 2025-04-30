
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Monitor, Loader2 } from 'lucide-react';
import CoreWebVitalsPanel from './CoreWebVitalsPanel';
import TechnicalAuditsPanel from './TechnicalAuditsPanel';
import OpportunitiesPanel from './OpportunitiesPanel';
import DevicePerformancePanel from './DevicePerformancePanel';

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
  
  // Process the data from PageSpeed API to our internal format
  const processPageSpeedData = (rawData: any) => {
    if (!rawData || !rawData.lighthouseResult) {
      console.warn('Missing or invalid PageSpeed data', rawData);
      return null;
    }
    
    try {
      const lighthouse = rawData.lighthouseResult;
      const audits = lighthouse.audits || {};
      
      // Extract performance metrics
      const fcp = audits['first-contentful-paint']?.numericValue / 1000 || 0;
      const lcp = audits['largest-contentful-paint']?.numericValue / 1000 || 0;
      const tbt = audits['total-blocking-time']?.numericValue || 0;
      const cls = audits['cumulative-layout-shift']?.numericValue || 0;
      const fid = audits['max-potential-fid']?.numericValue || 0;
      const speedIndex = audits['speed-index']?.numericValue / 1000 || 0;
      const tti = audits['interactive']?.numericValue / 1000 || 0;
      const performanceScore = lighthouse.categories?.performance?.score * 100 || 0;
      
      // Extract SEO audits
      const mobileFriendly = audits['viewport']?.score === 1;
      const https = audits['is-on-https']?.score === 1;
      const mixedContent = audits['is-on-https']?.score !== 1;
      
      // Extract headings and meta tags
      const hasH1 = audits['heading-order']?.score === 1;
      const multipleH1 = audits['heading-order']?.score !== 1;
      const headingsOrder = audits['heading-order']?.score === 1;
      
      const metaTags = {
        title: audits['document-title']?.displayValue || '',
        description: audits['meta-description']?.displayValue || '',
        titleLength: audits['document-title']?.displayValue?.length || 0,
        descriptionLength: audits['meta-description']?.displayValue?.length || 0
      };
      
      // Extract recommendations
      const recommendations = [];
      
      // Add opportunities as recommendations
      const opportunityAudits = Object.values(audits).filter((audit: any) => 
        audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1
      );
      
      opportunityAudits.forEach((audit: any, index) => {
        recommendations.push({
          id: audit.id || `opp-${index}`,
          title: audit.title || '',
          description: audit.description || '',
          impact: audit.score < 0.5 ? 'high' : audit.score < 0.9 ? 'medium' : 'low',
          category: 'performance'
        });
      });
      
      return {
        performanceScore,
        fcp,
        lcp,
        tbt,
        cls,
        speedIndex,
        tti,
        fid,
        mobileFriendly,
        security: {
          https,
          mixedContent
        },
        headingsStructure: {
          hasH1,
          multipleH1,
          headingsOrder
        },
        metaTags,
        recommendations
      };
    } catch (err) {
      console.error('Error processing PageSpeed data:', err);
      return null;
    }
  };
  
  // Process the data for both desktop and mobile
  const processedDesktopData = desktopData ? processPageSpeedData(desktopData) : null;
  const processedMobileData = mobileData ? processPageSpeedData(mobileData) : null;
  
  console.log('Processed desktop data:', processedDesktopData);
  console.log('Processed mobile data:', processedMobileData);
  
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
          
          {desktopData && processedDesktopData && (
            <div className="p-6 space-y-6">
              <DevicePerformancePanel 
                data={processedDesktopData}
                deviceType="desktop"
              />
              
              <CoreWebVitalsPanel 
                lcp={processedDesktopData.lcp || 0}
                cls={processedDesktopData.cls || 0}
                fid={processedDesktopData.fid || 0}
              />
              
              <TechnicalAuditsPanel 
                data={{
                  mobileFriendly: processedDesktopData.mobileFriendly || false,
                  security: processedDesktopData.security || {
                    https: false,
                    mixedContent: false
                  },
                  headingsStructure: processedDesktopData.headingsStructure || {
                    hasH1: false,
                    multipleH1: false,
                    headingsOrder: false
                  },
                  metaTags: processedDesktopData.metaTags || {
                    title: '',
                    description: '',
                    titleLength: 0,
                    descriptionLength: 0
                  }
                }}
              />
              
              <OpportunitiesPanel 
                opportunities={processedDesktopData.recommendations || []}
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
          
          {mobileData && processedMobileData && (
            <div className="p-6 space-y-6">
              <DevicePerformancePanel 
                data={processedMobileData}
                deviceType="mobile"
              />
              
              <CoreWebVitalsPanel 
                lcp={processedMobileData.lcp || 0}
                cls={processedMobileData.cls || 0}
                fid={processedMobileData.fid || 0}
              />
              
              <TechnicalAuditsPanel 
                data={{
                  mobileFriendly: processedMobileData.mobileFriendly || false,
                  security: processedMobileData.security || {
                    https: false,
                    mixedContent: false
                  },
                  headingsStructure: processedMobileData.headingsStructure || {
                    hasH1: false,
                    multipleH1: false,
                    headingsOrder: false
                  },
                  metaTags: processedMobileData.metaTags || {
                    title: '',
                    description: '',
                    titleLength: 0,
                    descriptionLength: 0
                  }
                }}
              />
              
              <OpportunitiesPanel 
                opportunities={processedMobileData.recommendations || []}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceTabsSection;

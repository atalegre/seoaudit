
import React, { useState } from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import UrlInputSection from '@/components/seo/UrlInputSection';
import DeviceTabsSection from '@/components/seo/DeviceTabsSection';
import { useSeoAnalysis } from '@/hooks/useSeoAnalysis';

const SeoAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('desktop');
  const { 
    url, 
    isAnalyzing, 
    desktopData, 
    mobileData, 
    error,
    handleUrlChange, 
    handleReanalyze, 
    extractDomain 
  } = useSeoAnalysis();

  return (
    <SuiteLayout 
      title="Análise SEO Technical"
      domain={url ? extractDomain(url) : undefined}
      onRerunAnalysis={handleReanalyze}
      isAnalyzing={isAnalyzing}
    >
      <div className="space-y-6">
        <UrlInputSection 
          url={url}
          isAnalyzing={isAnalyzing}
          extractDomain={extractDomain}
          onUrlChange={handleUrlChange}
          onReanalyze={handleReanalyze}
        />

        <DeviceTabsSection 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          desktopData={desktopData}
          mobileData={mobileData}
          isAnalyzing={isAnalyzing}
          error={error}
        />
      </div>
    </SuiteLayout>
  );
};

export default SeoAnalysisPage;

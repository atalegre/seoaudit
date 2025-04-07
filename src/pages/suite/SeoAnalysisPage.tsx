
import React, { useState } from 'react';
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
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Análise SEO Technical</h1>
      
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
  );
};

export default SeoAnalysisPage;

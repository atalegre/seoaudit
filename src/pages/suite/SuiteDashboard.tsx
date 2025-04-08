
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import SuiteLayout from '@/components/suite/SuiteLayout';
import EmptyDashboardState from '@/components/suite/dashboard/EmptyDashboardState';
import DashboardContent from '@/components/suite/dashboard/DashboardContent';
import { useDashboardState } from '@/hooks/suite/useDashboardState';

const SuiteDashboard = () => {
  const { user } = useUser();
  const { toast: hookToast } = useToast();
  
  const {
    url,
    domain,
    lastAnalysisDate,
    isLoading,
    logoUrl,
    totalScore,
    seoScore,
    aioScore,
    llmScore,
    performanceScore,
    directoryScore,
    keywordScore,
    recommendations,
    analyzeDomain,
    setAnalyzeDomain,
    handleRerunAnalysis
  } = useDashboardState();
  
  const handleViewMoreRecommendations = () => {
    if (!user) {
      hookToast({
        title: "Login necessário",
        description: "Faça login para ver todas as recomendações detalhadas.",
      });
      return;
    }
    
    // Navigate to recommendations page
  };
  
  // Render empty state if no URL for analysis
  if (!url) {
    return (
      <SuiteLayout 
        title="Dashboard" 
        domain={''} 
        lastAnalysisDate={''}
      >
        <EmptyDashboardState 
          analyzeDomain={analyzeDomain}
          setAnalyzeDomain={setAnalyzeDomain}
        />
      </SuiteLayout>
    );
  }
  
  return (
    <SuiteLayout 
      title="Dashboard" 
      domain={domain} 
      lastAnalysisDate={lastAnalysisDate}
      onRerunAnalysis={handleRerunAnalysis}
      isAnalyzing={isLoading}
    >
      <DashboardContent
        domain={domain}
        logoUrl={logoUrl}
        totalScore={totalScore}
        seoScore={seoScore}
        aioScore={aioScore}
        llmScore={llmScore}
        performanceScore={performanceScore}
        directoryScore={directoryScore}
        keywordScore={keywordScore}
        recommendations={recommendations}
        isUserLoggedIn={!!user}
        onViewMoreRecommendations={handleViewMoreRecommendations}
      />
    </SuiteLayout>
  );
};

export default SuiteDashboard;

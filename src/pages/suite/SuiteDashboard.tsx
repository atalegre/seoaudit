
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import SuiteLayout from '@/components/suite/SuiteLayout';
import EmptyDashboardState from '@/components/suite/dashboard/EmptyDashboardState';
import DashboardContent from '@/components/suite/dashboard/DashboardContent';
import UserOnboarding from '@/components/suite/dashboard/UserOnboarding';
import SuiteOnboarding from '@/components/suite/dashboard/SuiteOnboarding';
import { useDashboardState, SampleRecommendation } from '@/hooks/suite/useDashboardState';
import { toast } from 'sonner';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useUrlState } from '@/hooks/suite/dashboard/useUrlState';

const SuiteDashboard = () => {
  const { user } = useUser();
  const { toast: hookToast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  
  // Extract URL and projectId from query string
  const urlParam = searchParams.get('url');
  const projectId = searchParams.get('projectId');
  
  const { url, setUrl } = useUrlState();
  
  const {
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
    handleRerunAnalysis
  } = useDashboardState();
  
  // Check parameters and initiate analysis when loading the page
  useEffect(() => {
    if (urlParam && (!url || urlParam !== url)) {
      // Save to localStorage
      localStorage.setItem('lastAnalyzedUrl', urlParam);
      
      // Show toast notification
      toast.info("Analisando website", {
        description: `Obtendo dados para ${urlParam}`,
        duration: 3000
      });
      
      // Set URL for analysis
      setUrl(urlParam);
      setTimeout(() => {
        handleRerunAnalysis();
      }, 500);
    }
    
    // Check for pending URL in sessionStorage (from login flow)
    const pendingUrl = sessionStorage.getItem('pendingAnalysisUrl');
    if (pendingUrl && (!url || pendingUrl !== url)) {
      // Save to localStorage
      localStorage.setItem('lastAnalyzedUrl', pendingUrl);
      
      // Remove from sessionStorage to prevent repeated analysis
      sessionStorage.removeItem('pendingAnalysisUrl');
      
      // Show toast notification
      toast.info("Analisando website", {
        description: `Obtendo dados para ${pendingUrl}`,
        duration: 3000
      });
      
      // Set URL for analysis
      setUrl(pendingUrl);
      setTimeout(() => {
        handleRerunAnalysis();
      }, 500);
    }
    
    // Check if user is logged in and it's their first visit (for onboarding)
    if (user && !localStorage.getItem('userOnboardingDismissed')) {
      setShowOnboarding(true);
    }

    // Check if the tour should be shown
    if (!localStorage.getItem('suiteOnboardingCompleted') && url) {
      setShowTour(true);
    }
  }, [urlParam, user, url, setUrl, handleRerunAnalysis]);
  
  const handleViewMoreRecommendations = () => {
    if (!user) {
      hookToast({
        title: "Login necessário",
        description: "Faça login para ver todas as recomendações detalhadas.",
      });
      return;
    }
    
    // Navigate to recommendations page
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A página de recomendações detalhadas estará disponível em breve."
    });
  };
  
  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('userOnboardingDismissed', 'true');
  };

  const handleCompleteTour = () => {
    setShowTour(false);
    localStorage.setItem('suiteOnboardingCompleted', 'true');
  };
  
  return (
    <SuiteLayout 
      title="Dashboard" 
      domain={domain} 
      lastAnalysisDate={lastAnalysisDate}
      onRerunAnalysis={handleRerunAnalysis}
      isAnalyzing={isLoading}
    >
      {/* Tour for new users */}
      {showTour && (
        <SuiteOnboarding 
          isFirstVisit={true} 
          onComplete={handleCompleteTour} 
        />
      )}

      {/* Onboarding for logged in users */}
      {showOnboarding && user && (
        <UserOnboarding 
          userName={user.name || user.email?.split('@')[0]} 
          onClose={handleDismissOnboarding} 
        />
      )}
      
      <DashboardContent />
    </SuiteLayout>
  );
};

export default SuiteDashboard;

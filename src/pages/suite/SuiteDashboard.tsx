
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import SuiteLayout from '@/components/suite/SuiteLayout';
import EmptyDashboardState from '@/components/suite/dashboard/EmptyDashboardState';
import DashboardContent from '@/components/suite/dashboard/DashboardContent';
import UserOnboarding from '@/components/suite/dashboard/UserOnboarding';
import { useDashboardState } from '@/hooks/suite/useDashboardState';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const SuiteDashboard = () => {
  const { user } = useUser();
  const { toast: hookToast } = useToast();
  const [searchParams] = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Extrair URL e projectId da query string
  const urlParam = searchParams.get('url');
  const projectId = searchParams.get('projectId');
  
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
  
  // Verificar parâmetros na URL ao carregar a página
  useEffect(() => {
    if (urlParam && urlParam !== url) {
      // Se houver uma URL na query string, guarda no localStorage
      localStorage.setItem('lastAnalyzedUrl', urlParam);
      
      // Executa análise para a URL da query string
      console.log('URL detectada nos parâmetros, iniciando análise:', urlParam);
      
      // Mostra toast para o usuário
      toast.info("Analisando website", {
        description: `Obtendo dados para ${urlParam}`,
        duration: 3000
      });
    }
    
    // Verificar se o usuário está logado e é a primeira vez que acessa (para onboarding)
    if (user && !localStorage.getItem('userOnboardingDismissed')) {
      setShowOnboarding(true);
    }
  }, [urlParam, user]);
  
  const handleViewMoreRecommendations = () => {
    if (!user) {
      hookToast({
        title: "Login necessário",
        description: "Faça login para ver todas as recomendações detalhadas.",
      });
      return;
    }
    
    // Navigate to recommendations page
    // Note: Esta funcionalidade seria implementada em uma fase futura
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A página de recomendações detalhadas estará disponível em breve."
    });
  };
  
  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('userOnboardingDismissed', 'true');
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
      {/* Onboarding para usuários logados */}
      {showOnboarding && user && (
        <UserOnboarding 
          userName={user.name || user.email?.split('@')[0]} 
          onClose={handleDismissOnboarding} 
        />
      )}
      
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
        lastAnalysisDate={lastAnalysisDate}
      />
    </SuiteLayout>
  );
};

export default SuiteDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SuiteOnboarding from './SuiteOnboarding';
import DomainHeader from './DomainHeader';
import ScoreCards from './ScoreCards';
import DashboardMetrics from './DashboardMetrics';
import DashboardRecommendations from './DashboardRecommendations';
import AvailableTools from './AvailableTools';
import FirstTimeExperience from './FirstTimeExperience';
import { SampleRecommendation } from '@/hooks/suite/dashboard/useRecommendations';

interface DashboardContentProps {
  domain: string;
  logoUrl?: string;
  totalScore: number;
  seoScore: number;
  aioScore: number;
  llmScore: number;
  performanceScore: number;
  directoryScore: number;
  keywordScore: number;
  recommendations: SampleRecommendation[];
  isUserLoggedIn: boolean;
  onViewMoreRecommendations: () => void;
  lastAnalysisDate?: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  domain,
  logoUrl,
  totalScore,
  seoScore,
  aioScore,
  llmScore,
  performanceScore,
  directoryScore,
  keywordScore,
  recommendations,
  isUserLoggedIn,
  onViewMoreRecommendations,
  lastAnalysisDate = new Date().toLocaleDateString()
}) => {
  const navigate = useNavigate();
  
  // Check if this is the first visit to the dashboard
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('suiteOnboardingCompleted');
  });
  
  // Check if onboarding tour should be shown
  const [showOnboardingTour, setShowOnboardingTour] = useState(() => {
    return localStorage.getItem('showOnboardingTour') === 'true' || isFirstVisit;
  });
  
  const [showOnboardingCompleted, setShowOnboardingCompleted] = useState(false);
  
  // Determine if this is the user's first time viewing results
  const [isFirstTimeResults, setIsFirstTimeResults] = useState(() => {
    const key = `dashboard_results_viewed_${domain}`;
    return !localStorage.getItem(key);
  });

  const handleOnboardingComplete = () => {
    setShowOnboardingCompleted(true);
    setShowOnboardingTour(false);
    localStorage.removeItem('showOnboardingTour');
    
    toast.success("Bem-vindo à SEOaudit!", {
      description: "Explore todas as ferramentas disponíveis para melhorar seu site."
    });
  };

  const navigateTo = (path: string) => {
    if (!isUserLoggedIn && (path === '/suite/writer' || path === '/suite/keywords' || path === '/suite/llm')) {
      toast.info("Esta funcionalidade completa requer conta", {
        description: "Registe-se para aceder a todas as ferramentas avançadas.",
        action: {
          label: "Criar conta",
          onClick: () => navigate('/signin')
        }
      });
    }
    
    navigate(path);
  };
  
  // Mark as viewed when user interacts with dashboard
  const handleFirstTimeInteraction = () => {
    if (isFirstTimeResults) {
      const key = `dashboard_results_viewed_${domain}`;
      localStorage.setItem(key, 'true');
      setIsFirstTimeResults(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onClick={handleFirstTimeInteraction}
    >
      <SuiteOnboarding 
        isFirstVisit={showOnboardingTour} 
        onComplete={handleOnboardingComplete} 
      />

      <DomainHeader domain={domain} logoUrl={logoUrl} />

      {isFirstTimeResults ? (
        <FirstTimeExperience 
          seoScore={seoScore}
          aioScore={aioScore}
          totalScore={totalScore}
          lastAnalysisDate={lastAnalysisDate}
          isUserLoggedIn={isUserLoggedIn}
          navigateTo={navigateTo}
        />
      ) : (
        <>
          <div id="dashboard-scores">
            <ScoreCards 
              seoScore={seoScore} 
              aioScore={aioScore} 
              navigateTo={navigateTo}
            />
          </div>

          <div id="dashboard-metrics" className="mt-8">
            <DashboardMetrics 
              performanceScore={performanceScore}
              llmScore={llmScore}
              directoryScore={directoryScore}
              keywordScore={keywordScore}
              isUserLoggedIn={isUserLoggedIn}
              navigateTo={navigateTo}
            />
          </div>

          <div id="dashboard-recommendations">
            <DashboardRecommendations 
              recommendations={recommendations}
              isUserLoggedIn={isUserLoggedIn}
              navigateTo={navigateTo}
              onViewMoreRecommendations={onViewMoreRecommendations}
            />
          </div>

          <div id="dashboard-tools">
            <AvailableTools 
              isUserLoggedIn={isUserLoggedIn}
              navigateTo={navigateTo}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DashboardContent;

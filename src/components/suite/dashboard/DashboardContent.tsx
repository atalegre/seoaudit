
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SuiteOnboarding from './SuiteOnboarding';
import DomainHeader from './DomainHeader';
import ScoreCards from './ScoreCards';
import DashboardMetrics from './DashboardMetrics';
import DashboardRecommendations from './DashboardRecommendations';
import AvailableTools from './AvailableTools';

interface RecommendationType {
  id: string;
  title: string;
  description: string;
  type: 'seo' | 'aio';
  impact: 'high' | 'medium' | 'low';
}

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
  recommendations: RecommendationType[];
  isUserLoggedIn: boolean;
  onViewMoreRecommendations: () => void;
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
  onViewMoreRecommendations
}) => {
  const navigate = useNavigate();
  
  const [showOnboardingCompleted, setShowOnboardingCompleted] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('suiteOnboardingCompleted');
  });

  const handleOnboardingComplete = () => {
    setShowOnboardingCompleted(true);
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
    >
      <SuiteOnboarding 
        isFirstVisit={isFirstVisit} 
        onComplete={handleOnboardingComplete} 
      />

      <DomainHeader domain={domain} logoUrl={logoUrl} />

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

      <DashboardRecommendations 
        recommendations={recommendations}
        isUserLoggedIn={isUserLoggedIn}
        navigateTo={navigateTo}
        onViewMoreRecommendations={onViewMoreRecommendations}
      />

      <AvailableTools 
        isUserLoggedIn={isUserLoggedIn}
        navigateTo={navigateTo}
      />
    </motion.div>
  );
};

export default DashboardContent;

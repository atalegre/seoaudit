
import React from 'react';
import { Card } from '@/components/ui/card';
import OverallScore from '@/components/suite/dashboard/OverallScore';
import ScoreCardsGrid from '@/components/suite/dashboard/ScoreCardsGrid';
import RecommendationsSection from '@/components/suite/dashboard/RecommendationsSection';
import HistoryTabs from '@/components/suite/dashboard/HistoryTabs';

interface DashboardContentProps {
  domain: string;
  logoUrl: string;
  totalScore: number;
  seoScore: number;
  aioScore: number;
  llmScore: number;
  performanceScore: number;
  directoryScore: number;
  keywordScore: number;
  recommendations: Array<{
    id: number;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    type: 'technical' | 'content' | 'structure' | 'ai';
  }>;
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
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Visão Geral do Site</h1>
        <p className="text-muted-foreground">
          Resumo da análise para {domain || 'seu site'}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <OverallScore 
          totalScore={totalScore} 
          logoUrl={logoUrl} 
          domain={domain} 
        />
        
        <ScoreCardsGrid 
          seoScore={seoScore}
          aioScore={aioScore}
          llmScore={llmScore}
          performanceScore={performanceScore}
          directoryScore={directoryScore}
          keywordScore={keywordScore}
        />
      </div>
      
      <RecommendationsSection 
        recommendations={recommendations}
        onViewMore={onViewMoreRecommendations}
      />
      
      <HistoryTabs 
        isUserLoggedIn={isUserLoggedIn} 
        onLogin={() => {}} 
      />
    </>
  );
};

export default DashboardContent;

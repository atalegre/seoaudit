
import React from 'react';
import ScoreCard from './ScoreCard';
import ImplementationCard from './ImplementationCard';

interface ScoreOverviewProps {
  seoScore: number;
  aioScore: number;
  accessibilityScore?: number;
  scoreDiff?: { seo: number; aio: number };
  lastUpdate?: string;
  implementedRecommendations?: number;
  totalRecommendations?: number;
}

const ScoreOverview = ({
  seoScore,
  aioScore,
  accessibilityScore = 0,
  scoreDiff = { seo: 0, aio: 0 },
  lastUpdate = '',
  implementedRecommendations = 0,
  totalRecommendations = 0
}: ScoreOverviewProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
      <ScoreCard 
        title="Score SEO" 
        description="Pontuação atual do seu site" 
        score={seoScore} 
        scoreDiff={scoreDiff.seo} 
        lastUpdate={lastUpdate} 
      />
      
      <ScoreCard 
        title="Score AIO" 
        description="Pontuação para IA" 
        score={aioScore} 
        scoreDiff={scoreDiff.aio} 
        lastUpdate={lastUpdate}
        colorClass="bg-purple-500" 
      />
      
      <ImplementationCard 
        implementedRecommendations={implementedRecommendations} 
        totalRecommendations={totalRecommendations} 
      />
    </div>
  );
};

export default ScoreOverview;

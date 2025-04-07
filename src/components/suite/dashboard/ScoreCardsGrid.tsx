
import React from 'react';
import ScoreCard from '@/components/suite/dashboard/ScoreCard';
import { 
  Settings, Bot, Globe, MapPin, 
  KeySquare, Brain, Zap
} from 'lucide-react';

interface ScoreCardsGridProps {
  seoScore: number;
  aioScore: number;
  llmScore: number;
  performanceScore: number;
  directoryScore: number;
  keywordScore: number;
}

const ScoreCardsGrid = ({ 
  seoScore, 
  aioScore, 
  llmScore, 
  performanceScore, 
  directoryScore, 
  keywordScore 
}: ScoreCardsGridProps) => {
  return (
    <>
      <ScoreCard 
        title="SEO Score" 
        score={seoScore} 
        icon={<Settings />} 
        color="text-blue-600" 
        bgColor="bg-blue-100" 
      />
      
      <ScoreCard 
        title="AIO Score" 
        score={aioScore} 
        icon={<Bot />} 
        color="text-purple-600" 
        bgColor="bg-purple-100" 
      />
      
      <ScoreCard 
        title="Presença em IA" 
        score={llmScore} 
        icon={<Globe />} 
        color="text-indigo-600" 
        bgColor="bg-indigo-100" 
      />
      
      <ScoreCard 
        title="Performance Técnica" 
        score={performanceScore} 
        icon={<Zap />} 
        color="text-green-600" 
        bgColor="bg-green-100" 
      />
      
      <ScoreCard 
        title="Presença em Diretórios" 
        score={directoryScore} 
        icon={<MapPin />} 
        color="text-orange-600" 
        bgColor="bg-orange-100" 
      />
      
      <ScoreCard 
        title="Keywords Tracking" 
        score={keywordScore} 
        icon={<KeySquare />} 
        color="text-yellow-600" 
        bgColor="bg-yellow-100" 
      />
    </>
  );
};

export default ScoreCardsGrid;


import React from 'react';
import { BarChart3, Sparkles, BrainCircuit, Zap, MapPin, Search } from 'lucide-react';
import ScoreCard from './ScoreCard';

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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <ScoreCard 
        title="SEO" 
        score={seoScore} 
        icon={<BarChart3 />} 
        color="text-blue-600" 
        bgColor="bg-blue-50"
      />
      
      <ScoreCard 
        title="AIO" 
        score={aioScore} 
        icon={<Sparkles />} 
        color="text-purple-600" 
        bgColor="bg-purple-50"
      />
      
      <ScoreCard 
        title="LLM" 
        score={llmScore} 
        icon={<BrainCircuit />} 
        color="text-green-600" 
        bgColor="bg-green-50"
      />
      
      <ScoreCard 
        title="Performance" 
        score={performanceScore} 
        icon={<Zap />} 
        color="text-amber-600" 
        bgColor="bg-amber-50"
      />
      
      <ScoreCard 
        title="Diretórios" 
        score={directoryScore} 
        icon={<MapPin />} 
        color="text-red-600" 
        bgColor="bg-red-50"
      />
      
      <ScoreCard 
        title="Keywords" 
        score={keywordScore} 
        icon={<Search />} 
        color="text-teal-600" 
        bgColor="bg-teal-50"
      />
    </div>
  );
};

export default ScoreCardsGrid;

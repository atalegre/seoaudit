
import React from 'react';
import { BarChart3, Sparkles, BrainCircuit, Zap, MapPin, Search } from 'lucide-react';
import ScoreCard from './ScoreCard';
import { useBreakpoint } from '@/hooks/use-mobile';

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
  const { breakpoint } = useBreakpoint();
  
  // Use smaller icons on mobile devices
  const iconSize = breakpoint === 'xs' || breakpoint === 'sm' ? 16 : 20;
  
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      <ScoreCard 
        title="SEO" 
        score={seoScore} 
        icon={<BarChart3 size={iconSize} />} 
        color="text-blue-600" 
        bgColor="bg-blue-50"
      />
      
      <ScoreCard 
        title="AIO" 
        score={aioScore} 
        icon={<Sparkles size={iconSize} />} 
        color="text-purple-600" 
        bgColor="bg-purple-50"
      />
      
      <ScoreCard 
        title="LLM" 
        score={llmScore} 
        icon={<BrainCircuit size={iconSize} />} 
        color="text-green-600" 
        bgColor="bg-green-50"
      />
      
      <ScoreCard 
        title="Performance" 
        score={performanceScore} 
        icon={<Zap size={iconSize} />} 
        color="text-amber-600" 
        bgColor="bg-amber-50"
      />
      
      <ScoreCard 
        title="Diretórios" 
        score={directoryScore} 
        icon={<MapPin size={iconSize} />} 
        color="text-red-600" 
        bgColor="bg-red-50"
      />
      
      <ScoreCard 
        title="Keywords" 
        score={keywordScore} 
        icon={<Search size={iconSize} />} 
        color="text-teal-600" 
        bgColor="bg-teal-50"
      />
    </div>
  );
};

export default ScoreCardsGrid;

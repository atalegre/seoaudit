
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
  
  // Define cards to avoid repetition
  const scoreCards = [
    {
      title: "SEO",
      score: seoScore,
      icon: <BarChart3 size={iconSize} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Performance em buscadores"
    },
    {
      title: "AIO",
      score: aioScore,
      icon: <Sparkles size={iconSize} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Otimização para IA"
    },
    {
      title: "LLM",
      score: llmScore,
      icon: <BrainCircuit size={iconSize} />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Presença em ChatGPT"
    },
    {
      title: "Performance",
      score: performanceScore,
      icon: <Zap size={iconSize} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Velocidade e responsividade"
    },
    {
      title: "Diretórios",
      score: directoryScore,
      icon: <MapPin size={iconSize} />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Google Business e outros"
    },
    {
      title: "Keywords",
      score: keywordScore,
      icon: <Search size={iconSize} />,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      description: "Palavras-chave relevantes"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {scoreCards.map((card, index) => (
        <ScoreCard 
          key={index}
          title={card.title} 
          score={card.score} 
          icon={card.icon} 
          color={card.color} 
          bgColor={card.bgColor}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default ScoreCardsGrid;

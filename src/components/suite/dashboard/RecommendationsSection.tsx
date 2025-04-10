
import React from 'react';
import { Button } from '@/components/ui/button';
import RecommendationCard from './RecommendationCard';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations: {
    id: string | number;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low'; // Restrict to only these valid values
    type: string;
  }[];
  onViewMore: () => void;
}

const RecommendationsSection = ({ recommendations, onViewMore }: RecommendationsSectionProps) => {
  const getImpactIcon = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'technical':
        return 'Técnico';
      case 'content':
        return 'Conteúdo';
      case 'structure':
        return 'Estrutura';
      case 'ai':
        return 'IA';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma recomendação disponível. Execute uma análise para obter recomendações.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              title={recommendation.title}
              description={recommendation.description}
              impact={recommendation.impact as 'high' | 'medium' | 'low'} // Ensure the correct type
              type={getTypeLabel(recommendation.type)}
              icon={getImpactIcon(recommendation.impact as 'high' | 'medium' | 'low')} // Ensure the correct type
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;

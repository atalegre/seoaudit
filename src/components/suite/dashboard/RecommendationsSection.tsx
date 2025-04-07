
import React from 'react';
import { Button } from "@/components/ui/button";
import RecommendationCard from '@/components/suite/dashboard/RecommendationCard';
import { ArrowRight } from 'lucide-react';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'technical' | 'content' | 'structure' | 'ai';
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  onViewMore: () => void;
}

const RecommendationsSection = ({ recommendations, onViewMore }: RecommendationsSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recomendações Principais</h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewMore}
        >
          Ver todas 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map(rec => (
          <RecommendationCard
            key={rec.id}
            title={rec.title}
            description={rec.description}
            impact={rec.impact}
            type={rec.type}
            onLearnMore={onViewMore}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;


import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: string;
  icon?: React.ReactNode;
}

const RecommendationCard = ({
  title,
  description,
  impact,
  type,
  icon
}: RecommendationCardProps) => {
  // Impact colors
  const impactColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-amber-200 bg-amber-50',
    low: 'border-blue-200 bg-blue-50'
  };
  
  const impactTextColors = {
    high: 'text-red-700',
    medium: 'text-amber-700',
    low: 'text-blue-700'
  };
  
  const impactLabels = {
    high: 'Alto Impacto',
    medium: 'Médio Impacto',
    low: 'Baixo Impacto'
  };

  return (
    <div className={cn(
      "rounded-lg border p-4 transition-all hover:shadow-sm",
      impactColors[impact]
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", impactTextColors[impact], impactColors[impact])}>
                {impactLabels[impact]}
              </span>
              <span className="text-xs text-muted-foreground">{type}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;

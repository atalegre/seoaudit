
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

interface ModelCardProps {
  modelName: string;
  presencePercentage: number;
}

const ModelCard: React.FC<ModelCardProps> = ({ modelName, presencePercentage }) => {
  const getProgressColor = (score: number) => {
    if (score > 70) return 'bg-aio';  // Good
    if (score > 30) return 'bg-amber-500';  // Medium
    return 'bg-red-500';  // Poor
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-aio" />
          <span>{modelName}</span>
        </div>
        <span className="text-sm font-medium">{presencePercentage}%</span>
      </div>
      <Progress 
        value={presencePercentage} 
        className="h-2" 
        indicatorClassName={getProgressColor(presencePercentage)} 
      />
    </div>
  );
};

export default ModelCard;


import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

interface ModelCardProps {
  modelName: string;
  presencePercentage: number;
}

const ModelCard: React.FC<ModelCardProps> = ({ modelName, presencePercentage }) => {
  const getColorClass = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
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
        indicatorClassName={getColorClass(presencePercentage)} 
      />
    </div>
  );
};

export default ModelCard;

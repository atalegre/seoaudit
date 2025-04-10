
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface OnboardingProgressProps {
  completedSteps: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ 
  completedSteps, 
  totalSteps 
}) => {
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">Progresso</span>
        <span className="text-xs font-medium">{completedSteps}/{totalSteps}</span>
      </div>
      <Progress value={progressPercentage} className="h-1.5" />
    </div>
  );
};

export default OnboardingProgress;

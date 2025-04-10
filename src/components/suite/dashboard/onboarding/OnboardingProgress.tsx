
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
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-muted-foreground">Progresso de configuração</span>
        <span className="text-xs font-medium">{completedSteps}/{totalSteps}</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default OnboardingProgress;

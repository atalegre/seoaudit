
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
  const progress = (completedSteps / totalSteps) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Progresso de configuração</span>
        <span className="font-medium">{completedSteps}/{totalSteps}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default OnboardingProgress;

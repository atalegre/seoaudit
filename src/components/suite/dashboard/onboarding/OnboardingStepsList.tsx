
import React from 'react';
import { Check } from 'lucide-react';
import { OnboardingStep } from './types';

interface OnboardingStepsListProps {
  steps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
}

const OnboardingStepsList: React.FC<OnboardingStepsListProps> = ({ 
  steps, 
  onStepClick 
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {steps.map((step) => (
        <div 
          key={step.id}
          className={`flex items-start gap-1.5 p-1.5 rounded-md cursor-pointer transition-colors ${
            step.completed 
              ? 'bg-green-50/50 border border-green-100' 
              : 'bg-white border hover:bg-gray-50'
          }`}
          onClick={() => onStepClick(step)}
        >
          <div className={`rounded-full p-0.5 ${
            step.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {step.completed ? <Check className="h-2.5 w-2.5" /> : <span className="h-2.5 w-2.5 block" />}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-medium">{step.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnboardingStepsList;

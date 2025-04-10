
import React from 'react';
import { Check } from 'lucide-react';
import { OnboardingStep } from './useOnboardingSteps';

interface OnboardingStepsListProps {
  steps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
}

const OnboardingStepsList: React.FC<OnboardingStepsListProps> = ({ 
  steps, 
  onStepClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {steps.map((step) => (
        <div 
          key={step.id}
          className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${
            step.completed 
              ? 'bg-green-50/50 border border-green-100' 
              : 'bg-white border hover:bg-gray-50'
          }`}
          onClick={() => onStepClick(step)}
        >
          <div className={`rounded-full p-1 ${
            step.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {step.completed ? <Check className="h-3 w-3" /> : <span className="h-3 w-3 block" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{step.title}</h4>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnboardingStepsList;

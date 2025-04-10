
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTourPosition } from './useTourPosition';
import TourTooltip from './TourTooltip';
import TourHighlightStyles from './TourHighlightStyles';
import { OnboardingTourProps } from './types';

const OnboardingTour: React.FC<OnboardingTourProps> = ({ 
  steps, 
  onComplete,
  isOpen 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { position, isVisible, highlightElement } = useTourPosition(currentStep, steps, isOpen);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setTimeout(() => setCurrentStep(currentStep - 1), 300);
    }
  };

  const handleComplete = () => {
    setTimeout(() => {
      // Clear highlight classes from all possible elements
      steps.forEach(step => {
        const element = document.getElementById(step.targetId);
        if (element) {
          element.classList.remove('onboarding-target', 'pulse-highlight');
        }
      });
      onComplete();
    }, 300);
  };

  const handleCtaClick = () => {
    const currentCta = steps[currentStep]?.cta;
    if (currentCta?.action) {
      currentCta.action();
    }
    handleNext();
  };

  if (!isOpen || steps.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 z-50 overflow-hidden pointer-events-auto">
        <TourHighlightStyles />
        
        {/* Overlay that allows clicking on the underlying element */}
        <div 
          className="absolute inset-0 cursor-pointer" 
          onClick={handleComplete}
        />
        
        {isVisible && (
          <TourTooltip
            step={steps[currentStep]}
            currentStep={currentStep}
            totalSteps={steps.length}
            position={position}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onClose={handleComplete}
            onCtaClick={handleCtaClick}
          />
        )}
      </div>
    </AnimatePresence>
  );
};

export default OnboardingTour;

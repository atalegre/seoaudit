
import { useState, useEffect } from 'react';
import { TourStep } from './types';

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const useTourPosition = (
  currentStep: number,
  steps: TourStep[],
  isOpen: boolean
): { position: Position; isVisible: boolean; highlightElement: () => void } => {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const highlightElement = () => {
    if (!isOpen || steps.length === 0) return;
    
    const targetElement = document.getElementById(steps[currentStep].targetId);
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    
    // Calculate position based on specified direction
    let newPosition = { top: 0, left: 0, width: rect.width, height: rect.height };
    
    switch (steps[currentStep].position) {
      case 'top':
        newPosition.top = rect.top - 120;
        newPosition.left = rect.left + rect.width / 2 - 150;
        break;
      case 'bottom':
        newPosition.top = rect.bottom + 10;
        newPosition.left = rect.left + rect.width / 2 - 150;
        break;
      case 'left':
        newPosition.top = rect.top + rect.height / 2 - 60;
        newPosition.left = rect.left - 310;
        break;
      case 'right':
        newPosition.top = rect.top + rect.height / 2 - 60;
        newPosition.left = rect.right + 10;
        break;
    }
    
    setPosition(newPosition);
    setIsVisible(true);
    
    // Add visual highlight to target element
    targetElement.classList.add('onboarding-target');
    targetElement.classList.add('pulse-highlight');
  };

  useEffect(() => {
    const timer = setTimeout(highlightElement, 100);
    
    return () => {
      clearTimeout(timer);
      const targetElement = document.getElementById(steps[currentStep]?.targetId);
      if (targetElement) {
        targetElement.classList.remove('onboarding-target', 'pulse-highlight');
      }
      setIsVisible(false);
    };
  }, [currentStep, isOpen]);

  return { position, isVisible, highlightElement };
};

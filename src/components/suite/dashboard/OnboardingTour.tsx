
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  title: string;
  description: string;
  targetId: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  isOpen: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ 
  steps, 
  onComplete,
  isOpen 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  // Posiciona o tooltip próximo ao elemento alvo
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;
    
    const targetElement = document.getElementById(steps[currentStep].targetId);
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    
    // Calcula a posição baseada na direção especificada
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
    
    // Adiciona destaque visual ao elemento alvo
    targetElement.classList.add('onboarding-target');
    
    return () => {
      targetElement.classList.remove('onboarding-target');
    };
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Marca o onboarding como concluído
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  if (!isOpen || steps.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/20 z-50 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute pointer-events-auto bg-white rounded-lg shadow-lg p-4 w-300 z-50 max-w-[300px]"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2" 
            onClick={handleComplete}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="mb-2 text-sm text-muted-foreground">
            Passo {currentStep + 1} de {steps.length}
          </div>
          
          <h3 className="text-base font-semibold mb-2">{steps[currentStep].title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{steps[currentStep].description}</p>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? 'Próximo' : 'Concluir'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingTour;

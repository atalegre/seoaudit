
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TourStep {
  title: string;
  description: string;
  targetId: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  cta?: {
    text: string;
    action?: () => void;
  };
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
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Posiciona o tooltip próximo ao elemento alvo
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;
    
    const showTooltip = () => {
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
      setTooltipVisible(true);
      
      // Adiciona destaque visual ao elemento alvo
      targetElement.classList.add('onboarding-target');
      
      // Se houver, aplica animação para destacar o elemento
      targetElement.classList.add('pulse-highlight');
    };

    // Pequeno atraso para garantir que elementos do DOM estejam prontos
    const timer = setTimeout(showTooltip, 100);
    
    return () => {
      clearTimeout(timer);
      const targetElement = document.getElementById(steps[currentStep]?.targetId);
      if (targetElement) {
        targetElement.classList.remove('onboarding-target', 'pulse-highlight');
      }
      setTooltipVisible(false);
    };
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setTooltipVisible(false);
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setTooltipVisible(false);
      setTimeout(() => setCurrentStep(currentStep - 1), 300);
    }
  };

  const handleComplete = () => {
    setTooltipVisible(false);
    setTimeout(() => {
      // Limpa classes de destaque de todos os elementos possíveis
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
        {/* Overlay que permite clicar no elemento subjacente */}
        <div 
          className="absolute inset-0 cursor-pointer" 
          onClick={handleComplete}
        />
        
        {tooltipVisible && (
          <motion.div
            className="absolute pointer-events-auto bg-white rounded-lg shadow-xl p-5 w-[320px] z-50"
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
            
            <div className="mb-2 text-sm text-muted-foreground flex items-center">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">
                {currentStep + 1}
              </span>
              <span>Passo {currentStep + 1} de {steps.length}</span>
            </div>
            
            <h3 className="text-base font-semibold mb-2">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{steps[currentStep].description}</p>
            
            <div className="flex justify-between mt-5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              {steps[currentStep].cta ? (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleCtaClick}
                  className="gap-1"
                >
                  {steps[currentStep].cta.text}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleNext}
                  className="gap-1"
                >
                  {currentStep < steps.length - 1 ? 'Próximo' : 'Concluir'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default OnboardingTour;

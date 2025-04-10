
import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TourStep } from './types';

interface TourTooltipProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  position: { top: number; left: number; width: number; height: number };
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onCtaClick?: () => void;
}

const TourTooltip: React.FC<TourTooltipProps> = ({
  step,
  currentStep,
  totalSteps,
  position,
  onNext,
  onPrevious,
  onClose,
  onCtaClick,
}) => {
  return (
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
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="mb-2 text-sm text-muted-foreground flex items-center">
        <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">
          {currentStep + 1}
        </span>
        <span>Passo {currentStep + 1} de {totalSteps}</span>
      </div>
      
      <h3 className="text-base font-semibold mb-2">{step.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
      
      <div className="flex justify-between mt-5">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        {step.cta ? (
          <Button 
            variant="default" 
            size="sm"
            onClick={onCtaClick}
            className="gap-1"
          >
            {step.cta.text}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onNext}
            className="gap-1"
          >
            {currentStep < totalSteps - 1 ? 'Próximo' : 'Concluir'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default TourTooltip;

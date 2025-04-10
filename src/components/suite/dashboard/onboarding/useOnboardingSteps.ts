
import { useState, useEffect } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

export const useOnboardingSteps = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete seu perfil',
      description: 'Adicione suas informações profissionais para desbloquear recomendações personalizadas.',
      route: '/suite/profile',
      completed: false
    },
    {
      id: 'analyze',
      title: 'Analise seu primeiro site',
      description: 'Insira o URL do seu site principal para começar a análise completa.',
      route: '/suite',
      completed: false
    },
    {
      id: 'recommendations',
      title: 'Explore recomendações',
      description: 'Veja as recomendações e entenda como melhorar seu site.',
      route: '/suite',
      completed: false
    },
    {
      id: 'content',
      title: 'Crie seu primeiro conteúdo',
      description: 'Use nossa ferramenta de IA para gerar conteúdo otimizado.',
      route: '/suite/writer',
      completed: false
    }
  ]);

  // On component mount, check localStorage for completed steps
  useEffect(() => {
    const savedSteps = localStorage.getItem('onboardingCompletedSteps');
    if (savedSteps) {
      try {
        const completedStepIds = JSON.parse(savedSteps) as string[];
        setSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            completed: completedStepIds.includes(step.id)
          }))
        );
      } catch (e) {
        console.error('Error parsing completed steps from localStorage:', e);
      }
    } else {
      // Set analyze step as completed if we have a URL in localStorage
      if (localStorage.getItem('lastAnalyzedUrl')) {
        markStepAsComplete('analyze');
      }
    }
  }, []);

  const markStepAsComplete = (stepId: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    
    // Save to localStorage
    const completedStepIds = steps
      .filter(step => step.id === stepId || step.completed)
      .map(step => step.id);
    
    localStorage.setItem('onboardingCompletedSteps', JSON.stringify(completedStepIds));
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;

  return {
    steps,
    completedSteps,
    totalSteps,
    markStepAsComplete
  };
};

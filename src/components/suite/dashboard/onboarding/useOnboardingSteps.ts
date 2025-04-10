
import { useState } from 'react';
import { OnboardingStep } from './types';

export const useOnboardingSteps = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete seu perfil',
      description: 'Adicione suas informações profissionais para desbloquear recomendações personalizadas.',
      completed: false,
      route: '/dashboard/settings'
    },
    {
      id: 'site',
      title: 'Analise seu primeiro site',
      description: 'Insira o URL do seu site principal para começar a análise completa.',
      completed: true,
      route: '/suite'
    },
    {
      id: 'recommendations',
      title: 'Explore recomendações',
      description: 'Veja as recomendações e entenda como melhorar seu site.',
      completed: false,
      route: '/suite/seo'
    },
    {
      id: 'content',
      title: 'Crie seu primeiro conteúdo',
      description: 'Use nossa ferramenta de IA para gerar conteúdo otimizado.',
      completed: false,
      route: '/suite/writer'
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  
  const markStepAsComplete = (stepId: string) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, completed: true } : s
    ));
  };

  return {
    steps,
    completedSteps,
    totalSteps: steps.length,
    markStepAsComplete
  };
};


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingTour from './onboarding/OnboardingTour';
import { BarChart2, Brain, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface SuiteOnboardingProps {
  isFirstVisit: boolean;
  onComplete: () => void;
}

const SuiteOnboarding: React.FC<SuiteOnboardingProps> = ({ 
  isFirstVisit, 
  onComplete 
}) => {
  const [showOnboarding, setShowOnboarding] = useState(isFirstVisit);
  const navigate = useNavigate();

  // Define os passos do tour
  const onboardingSteps = [
    {
      title: 'Pontuação SEO e IA do seu site',
      description: 'Aqui pode ver como o seu website está a performar, tanto em SEO como em otimização para Inteligência Artificial.',
      targetId: 'dashboard-scores',
      position: 'bottom' as const,
      cta: {
        text: 'Entendi, continuar',
      }
    },
    {
      title: 'Navegue entre SEO e IA',
      description: 'Use estas tabs para alternar entre análises de SEO tradicional e otimização para IA. Cada uma tem recomendações específicas.',
      targetId: 'dashboard-metrics',
      position: 'right' as const,
      cta: {
        text: 'Ver mais',
      }
    },
    {
      title: 'Explore as recomendações de conteúdo',
      description: 'Com base na análise do seu site, criamos sugestões personalizadas para melhorar o seu conteúdo e visibilidade.',
      targetId: 'dashboard-recommendations',
      position: 'top' as const,
      cta: {
        text: 'Começar a explorar',
        action: () => {
          // Simular navegação para recomendações mais detalhadas
          toast.success('Bem-vindo à SEOaudit!', {
            description: 'Explore todas as ferramentas disponíveis para melhorar seu site.'
          });
        }
      }
    }
  ];

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    // Salvar no localStorage para não mostrar novamente
    localStorage.setItem('suiteOnboardingCompleted', 'true');
    onComplete();
  };

  // Adicionar CSS para o efeito de destaque
  useEffect(() => {
    if (showOnboarding) {
      // Adiciona CSS para o efeito de destaque pulsante
      const style = document.createElement('style');
      style.innerHTML = `
        .onboarding-target {
          position: relative;
          z-index: 60;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
          border-radius: 8px;
        }
        .pulse-highlight {
          animation: pulse-border 2s infinite;
        }
        @keyframes pulse-border {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [showOnboarding]);

  return (
    <OnboardingTour 
      steps={onboardingSteps} 
      onComplete={handleCompleteOnboarding} 
      isOpen={showOnboarding}
    />
  );
};

export default SuiteOnboarding;

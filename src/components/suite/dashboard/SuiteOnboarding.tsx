
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingTour from './onboarding/OnboardingTour';
import { BarChart2, Brain, Lightbulb, Search, FileText, Tool, Menu } from 'lucide-react';
import { toast } from 'sonner';

interface SuiteOnboardingProps {
  isFirstVisit: boolean;
  onComplete: () => void;
}

const SuiteOnboarding: React.FC<SuiteOnboardingProps> = ({ 
  isFirstVisit, 
  onComplete 
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if onboarding should be shown (first visit or explicitly set)
    const shouldShowOnboarding = isFirstVisit || localStorage.getItem('showOnboardingTour') === 'true';
    
    if (shouldShowOnboarding) {
      // Add a small delay to let the UI render first
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  // Define os passos do tour
  const onboardingSteps = [
    {
      title: 'Bem-vindo à SEOaudit!',
      description: 'Vamos dar uma visita guiada pela plataforma para que possa tirar o máximo proveito das ferramentas disponíveis.',
      targetId: 'dashboard-scores',
      position: 'bottom' as const,
      cta: {
        text: 'Começar o tour',
      }
    },
    {
      title: 'Pontuação do seu site',
      description: 'Aqui pode ver a análise completa do seu website, incluindo pontuações de SEO e otimização para Inteligência Artificial.',
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
      title: 'Explore as recomendações',
      description: 'Com base na análise do seu site, criamos sugestões personalizadas para melhorar o seu conteúdo e visibilidade.',
      targetId: 'dashboard-recommendations',
      position: 'top' as const,
      cta: {
        text: 'Próximo',
      }
    },
    {
      title: 'Ferramentas disponíveis',
      description: 'Explore todas as ferramentas disponíveis para otimizar seu site, incluindo gerador de conteúdo com IA e análise de palavras-chave.',
      targetId: 'dashboard-tools',
      position: 'top' as const,
      cta: {
        text: 'Próximo',
      }
    },
    {
      title: 'Menu de navegação',
      description: 'Utilize o menu lateral para navegar entre as diferentes ferramentas da plataforma.',
      targetId: 'sidebar-navigation',
      position: 'right' as const,
      cta: {
        text: 'Começar a explorar',
        action: () => {
          // Fechar o tour e mostrar mensagem de boas-vindas
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
    localStorage.removeItem('showOnboardingTour');
    onComplete();
  };

  return (
    <OnboardingTour 
      steps={onboardingSteps} 
      onComplete={handleCompleteOnboarding} 
      isOpen={showOnboarding}
    />
  );
};

export default SuiteOnboarding;

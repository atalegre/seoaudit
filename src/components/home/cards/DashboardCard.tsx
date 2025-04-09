
import React from 'react';
import { Bot } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardCard = () => {
  const { language } = useLanguage();
  
  const items = [
    language === 'pt' ? 'Recomendações personalizadas' : 'Personalized recommendations',
    language === 'pt' ? 'Histórico de análises' : 'Analysis history',
    language === 'pt' ? 'Gerador de conteúdo com IA' : 'AI content generator'
  ];
  
  return (
    <FeatureCard
      title={language === 'pt' ? 'Dashboard Profissional' : 'Professional Dashboard'}
      description={language === 'pt'
        ? 'Acesse relatórios detalhados, ferramentas de otimização de conteúdo e monitore o progresso do seu site ao longo do tempo.'
        : 'Access detailed reports, content optimization tools and monitor your site\'s progress over time.'
      }
      icon={<Bot className="h-7 w-7 text-green-600" />}
      items={items}
      linkText={language === 'pt' ? 'Acessar dashboard' : 'Access dashboard'}
      linkUrl="/signin"
      linkColor="green"
      gradientFrom="green"
      gradientTo="teal"
    />
  );
};

export default DashboardCard;

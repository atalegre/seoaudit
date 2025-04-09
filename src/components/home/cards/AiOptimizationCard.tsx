
import React from 'react';
import { Sparkles } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { useLanguage } from '@/contexts/LanguageContext';

const AiOptimizationCard = () => {
  const { language } = useLanguage();
  
  const getLocalizedPath = (ptPath: string, enPath: string) => {
    return language === 'pt' ? ptPath : enPath;
  };
  
  const items = [
    language === 'pt' ? 'Monitoramento de menções em LLMs' : 'LLM mentions monitoring',
    language === 'pt' ? 'Detecção de informações incorretas' : 'Incorrect information detection',
    language === 'pt' ? 'Estruturação de conteúdo para IA' : 'Content structuring for AI'
  ];
  
  return (
    <FeatureCard
      title={language === 'pt' ? 'Otimização para IA' : 'AI Optimization'}
      description={language === 'pt'
        ? 'Descubra como o ChatGPT e outros LLMs interpretam seu conteúdo e otimize-o para aparecer em resultados baseados em IA.'
        : 'Discover how ChatGPT and other LLMs interpret your content and optimize it to appear in AI-based results.'
      }
      icon={<Sparkles className="h-7 w-7 text-purple-600" />}
      items={items}
      linkText={language === 'pt' ? 'Explorar recursos' : 'Explore resources'}
      linkUrl={getLocalizedPath('/guias', '/guides')}
      linkColor="purple"
      gradientFrom="purple"
      gradientTo="indigo"
    />
  );
};

export default AiOptimizationCard;

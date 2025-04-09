
import React from 'react';
import { BarChart3 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { useLanguage } from '@/contexts/LanguageContext';

const SeoAnalysisCard = () => {
  const { language } = useLanguage();
  
  const getLocalizedPath = (ptPath: string, enPath: string) => {
    return language === 'pt' ? ptPath : enPath;
  };
  
  const items = [
    language === 'pt' ? 'Análise de Core Web Vitals' : 'Core Web Vitals Analysis',
    language === 'pt' ? 'Verificação de meta tags' : 'Meta tags verification',
    language === 'pt' ? 'Estrutura de headings' : 'Headings structure'
  ];
  
  return (
    <FeatureCard
      title={language === 'pt' ? 'Análise SEO Completa' : 'Complete SEO Analysis'}
      description={language === 'pt'
        ? 'Avalie a otimização técnica, velocidade, estrutura e metadata do seu site para maximizar a visibilidade nos motores de busca.'
        : 'Evaluate technical optimization, speed, structure and metadata of your site to maximize visibility in search engines.'
      }
      icon={<BarChart3 className="h-7 w-7 text-blue-600" />}
      items={items}
      linkText={language === 'pt' ? 'Saiba mais' : 'Learn more'}
      linkUrl={getLocalizedPath('/como-funciona', '/how-it-works')}
      linkColor="blue"
      gradientFrom="blue"
      gradientTo="indigo"
    />
  );
};

export default SeoAnalysisCard;

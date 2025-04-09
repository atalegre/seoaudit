
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SeoAnalysisCard from './cards/SeoAnalysisCard';
import AiOptimizationCard from './cards/AiOptimizationCard';
import DashboardCard from './cards/DashboardCard';

const FeatureCards = () => {
  const { language } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'pt' 
              ? 'Análise completa do seu site' 
              : 'Complete analysis of your website'
            }
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'pt'
              ? 'Nossa ferramenta oferece uma visão abrangente do desempenho do seu site, tanto para SEO tradicional quanto para otimização de IA.'
              : 'Our tool offers a comprehensive view of your website performance, both for traditional SEO and AI optimization.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <SeoAnalysisCard />
          <AiOptimizationCard />
          <DashboardCard />
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;


import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const SeoAnalysisCard = () => {
  const { language } = useLanguage();
  
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-violet-100 transition-all duration-300 hover:shadow-md bg-white">
      <div className="flex flex-col h-full">
        <div className="mb-6 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
          <BarChart className="h-8 w-8 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-bold mb-3">
          {language === 'pt' ? 'Análise SEO Completa' : 'Complete SEO Analysis'}
        </h3>
        
        <p className="text-gray-600 mb-6 flex-grow">
          {language === 'pt'
            ? 'Avaliação técnica completa do seu site com métricas de Core Web Vitals, estrutura e velocidade.'
            : 'Complete technical evaluation of your site with Core Web Vitals metrics, structure and speed.'}
        </p>
        
        <Button variant="outline" className="w-full mt-auto" asChild>
          <Link to="/suite/seo">
            {language === 'pt' ? 'Ver exemplo' : 'See example'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SeoAnalysisCard;

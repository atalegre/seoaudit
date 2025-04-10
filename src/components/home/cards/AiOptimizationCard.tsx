
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiOptimizationCard = () => {
  const { language } = useLanguage();
  
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-violet-100 transition-all duration-300 hover:shadow-md bg-white">
      <div className="flex flex-col h-full">
        <div className="mb-6 bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        
        <h3 className="text-xl font-bold mb-3">
          {language === 'pt' ? 'Otimização para IA' : 'AI Optimization'}
        </h3>
        
        <p className="text-gray-600 mb-6 flex-grow">
          {language === 'pt'
            ? 'Descubra como o ChatGPT e outros LLMs interpretam seu conteúdo e como melhorar sua visibilidade.'
            : 'Find out how ChatGPT and other LLMs interpret your content and how to improve your visibility.'}
        </p>
        
        <Button variant="outline" className="w-full mt-auto" asChild>
          <Link to="/suite/llm">
            {language === 'pt' ? 'Ver exemplo' : 'See example'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AiOptimizationCard;

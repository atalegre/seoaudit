
import React, { useState } from 'react';
import { Search, BarChart, Bot, LineChart, Sparkles, ListChecks, BrainCircuit, FileText, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const FeatureHighlights = () => {
  const { language } = useLanguage();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState(0);
  
  const categories = [
    {
      title: language === 'pt' ? 'Análises' : 'Analysis',
      features: [
        {
          title: 'SEO Score',
          description: language === 'pt' 
            ? 'Análise técnica completa com métricas de Core Web Vitals, estrutura e performance.' 
            : 'Complete technical analysis with Core Web Vitals metrics, structure and performance.',
          icon: <BarChart className="h-6 w-6 text-blue-600" />
        },
        {
          title: 'AIO Score',
          description: language === 'pt'
            ? 'Avaliação de como os modelos de inteligência artificial interpretam seu conteúdo.'
            : 'Assessment of how artificial intelligence models interpret your content.',
          icon: <Sparkles className="h-6 w-6 text-purple-600" />
        },
        {
          title: 'LLM Presence',
          description: language === 'pt'
            ? 'Verificação da presença do seu site em modelos como ChatGPT e Gemini.'
            : 'Verification of your site\'s presence in models like ChatGPT and Gemini.',
          icon: <Bot className="h-6 w-6 text-indigo-600" />
        }
      ]
    },
    {
      title: language === 'pt' ? 'Conteúdo' : 'Content',
      features: [
        {
          title: 'Writer Assistant',
          description: language === 'pt'
            ? 'IA que sugere conteúdo otimizado para SEO e LLMs com base nas suas keywords.'
            : 'AI that suggests optimized content for SEO and LLMs based on your keywords.',
          icon: <FileText className="h-6 w-6 text-orange-600" />
        },
        {
          title: 'Content Recommender',
          description: language === 'pt'
            ? 'Lista priorizada de melhorias para aumentar sua visibilidade online.'
            : 'Prioritized list of improvements to increase your online visibility.',
          icon: <ListChecks className="h-6 w-6 text-red-600" />
        }
      ]
    },
    {
      title: language === 'pt' ? 'Monitorização' : 'Monitoring',
      features: [
        {
          title: 'Keyword Tracker',
          description: language === 'pt'
            ? 'Acompanhamento do ranking das suas palavras-chave nos motores de busca.'
            : 'Tracking of your keywords ranking in search engines.',
          icon: <TrendingUp className="h-6 w-6 text-green-600" />
        }
      ]
    }
  ];
  
  const renderFeatureCards = (features) => {
    return features.map((feature, index) => (
      <div 
        key={index} 
        className="group relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-full bg-gray-50 p-3 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      </div>
    ));
  };

  const nextTab = () => {
    setActiveTab((prev) => (prev < categories.length - 1 ? prev + 1 : prev));
  };

  const prevTab = () => {
    setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {language === 'pt' ? 'Recursos da Plataforma' : 'Platform Features'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'pt'
              ? 'Ferramentas completas para análise e otimização do seu site'
              : 'Complete tools for analyzing and optimizing your site'
            }
          </p>
        </div>
        
        {isMobile ? (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevTab} 
                disabled={activeTab === 0}
                className="rounded-full"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <h3 className="text-xl font-bold">
                {categories[activeTab].title}
              </h3>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextTab} 
                disabled={activeTab === categories.length - 1}
                className="rounded-full"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {renderFeatureCards(categories[activeTab].features)}
            </div>
            
            <div className="flex justify-center mt-6">
              {categories.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index === activeTab ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveTab(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-8 gap-6">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    index === activeTab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {category.title}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {renderFeatureCards(categories[activeTab].features)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureHighlights;

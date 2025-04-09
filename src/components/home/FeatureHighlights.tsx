
import React from 'react';
import { Search, BarChart, Bot, LineChart, Sparkles, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FeatureHighlights = () => {
  const { language } = useLanguage();
  
  const features = [
    {
      title: language === 'pt' ? 'SEO Score' : 'SEO Score',
      description: language === 'pt' 
        ? 'Análise técnica completa com métricas de Core Web Vitals, estrutura e performance.' 
        : 'Complete technical analysis with Core Web Vitals metrics, structure and performance.',
      icon: <BarChart className="h-6 w-6 text-blue-600" />
    },
    {
      title: language === 'pt' ? 'AIO Score' : 'AIO Score',
      description: language === 'pt'
        ? 'Avaliação de como os modelos de inteligência artificial interpretam seu conteúdo.'
        : 'Assessment of how artificial intelligence models interpret your content.',
      icon: <Sparkles className="h-6 w-6 text-purple-600" />
    },
    {
      title: language === 'pt' ? 'LLM Presence' : 'LLM Presence',
      description: language === 'pt'
        ? 'Verificação da presença do seu site em modelos como ChatGPT e Gemini.'
        : 'Verification of your site\'s presence in models like ChatGPT and Gemini.',
      icon: <Bot className="h-6 w-6 text-indigo-600" />
    },
    {
      title: language === 'pt' ? 'Keyword Tracker' : 'Keyword Tracker',
      description: language === 'pt'
        ? 'Acompanhamento do ranking das suas palavras-chave nos motores de busca.'
        : 'Tracking of your keywords ranking in search engines.',
      icon: <LineChart className="h-6 w-6 text-green-600" />
    },
    {
      title: language === 'pt' ? 'Writer Assistant' : 'Writer Assistant',
      description: language === 'pt'
        ? 'IA que sugere conteúdo otimizado para SEO e LLMs com base nas suas keywords.'
        : 'AI that suggests optimized content for SEO and LLMs based on your keywords.',
      icon: <Search className="h-6 w-6 text-orange-600" />
    },
    {
      title: language === 'pt' ? 'Recomendações' : 'Recommendations',
      description: language === 'pt'
        ? 'Lista priorizada de melhorias para aumentar sua visibilidade online.'
        : 'Prioritized list of improvements to increase your online visibility.',
      icon: <ListChecks className="h-6 w-6 text-red-600" />
    },
  ];

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;

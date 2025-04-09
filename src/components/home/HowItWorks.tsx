
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { language } = useLanguage();
  
  const steps = [
    {
      number: '01',
      title: language === 'pt' ? 'Insira o URL do seu site' : 'Enter your website URL',
      description: language === 'pt' 
        ? 'Comece fornecendo o endereço do seu site para iniciar a análise completa.' 
        : 'Start by providing your website address to begin the complete analysis.'
    },
    {
      number: '02',
      title: language === 'pt' ? 'Obtenha uma análise detalhada' : 'Get a detailed analysis',
      description: language === 'pt' 
        ? 'Nossos algoritmos avaliam todos os aspectos técnicos e de conteúdo do seu site.' 
        : 'Our algorithms evaluate all technical and content aspects of your website.'
    },
    {
      number: '03',
      title: language === 'pt' ? 'Receba recomendações personalizadas' : 'Get personalized recommendations',
      description: language === 'pt' 
        ? 'Obtenha sugestões práticas para melhorar a visibilidade do seu site nos buscadores e na IA.' 
        : 'Get practical suggestions to improve your website visibility in search engines and AI.'
    },
    {
      number: '04',
      title: language === 'pt' ? 'Implemente as melhorias' : 'Implement improvements',
      description: language === 'pt' 
        ? 'Siga as recomendações e veja sua classificação subir nos resultados de busca e citações em IA.' 
        : 'Follow the recommendations and see your ranking rise in search results and AI citations.'
    }
  ];
  
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'pt' ? 'Como Funciona' : 'How It Works'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'pt'
              ? 'Descubra como nossa ferramenta pode ajudar a melhorar seu SEO e presença em IA em 4 passos simples'
              : 'Discover how our tool can help improve your SEO and AI presence in 4 simple steps'
            }
          </p>
        </div>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className={`relative ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16 lg:row-start-1'} ${index === 1 ? 'lg:col-start-2' : ''} ${index === 3 ? 'lg:col-start-2' : ''}`}>
                {/* Circle on timeline */}
                <div className="hidden lg:flex absolute top-10 w-12 h-12 rounded-full bg-white border-4 border-indigo-500 items-center justify-center right-0 transform translate-x-1/2 z-10">
                  <span className="font-bold text-indigo-500">{index + 1}</span>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center font-bold text-xl mr-4 lg:hidden">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

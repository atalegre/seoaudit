
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-indigo-600 font-semibold mb-2">
            {language === 'pt' ? 'PROCESSO SIMPLES' : 'SIMPLE PROCESS'}
          </span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-200 transform -translate-x-6 z-0 mt-5">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full absolute right-0 top-1/2 transform translate-x-1.5 -translate-y-1.5"></div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

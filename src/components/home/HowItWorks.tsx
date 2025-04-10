
import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  const { language } = useLanguage();
  const isMobile = useMobile();
  const [activeStep, setActiveStep] = useState(0);
  const carouselRef = useRef(null);
  
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
  
  const nextStep = () => {
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };
  
  const prevStep = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
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
        
        {isMobile ? (
          <div className="relative">
            <div 
              ref={carouselRef}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-center">
                <div key={steps[activeStep].number} className="w-full px-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                        {steps[activeStep].number}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{steps[activeStep].title}</h3>
                    <p className="text-gray-600">{steps[activeStep].description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevStep} 
                disabled={activeStep === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-center">
                <span className="text-sm font-medium">{activeStep + 1}/{steps.length}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextStep} 
                disabled={activeStep === steps.length - 1}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                      {step.number}
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-[calc(100%-3rem)] h-0.5 bg-gray-200 transform -translate-x-6 z-0">
                        <ArrowRight className="h-6 w-6 text-indigo-500 absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;

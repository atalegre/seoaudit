
import React from 'react';
import { Search, BarChart3, LineChart, FileText } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-10 w-10 text-blue-600" />,
    title: 'Insira o URL do site',
    description: 'Basta digitar o endereço do seu site para iniciar o processo de análise.'
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
    title: 'Análise automática',
    description: 'Nossa plataforma avalia seu site para SEO e presença em inteligência artificial.'
  },
  {
    icon: <LineChart className="h-10 w-10 text-blue-600" />,
    title: 'Dashboard personalizado',
    description: 'Acesse um dashboard completo com métricas e recomendações para seu site.'
  },
  {
    icon: <FileText className="h-10 w-10 text-blue-600" />,
    title: 'Implemente melhorias',
    description: 'Siga as recomendações para melhorar seu ranking e visibilidade online.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Processo simples e eficiente para analisar e melhorar seu site
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="rounded-full bg-blue-50 p-6 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-full h-1 bg-blue-100 hidden lg:block">
                    {index < steps.length - 1 && <div className="h-full w-full bg-blue-100"></div>}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

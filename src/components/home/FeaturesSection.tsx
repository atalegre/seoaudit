
import React from 'react';
import { Globe, BrainCircuit, Smartphone, Zap, Shield, Bot, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featuresList = [
  {
    icon: <Globe className="h-6 w-6 text-blue-600" />,
    title: 'Análise de SEO completa',
    description: 'Avalie todos os fatores técnicos que afetam a visibilidade do seu site nos motores de busca.'
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-purple-600" />,
    title: 'Otimização para IA',
    description: 'Verifique se o seu conteúdo está preparado para ser indexado pelos novos modelos de IA.'
  },
  {
    icon: <Smartphone className="h-6 w-6 text-green-600" />,
    title: 'Mobile-friendly',
    description: 'Teste a usabilidade do seu site em dispositivos móveis e garanta uma boa experiência.'
  },
  {
    icon: <Zap className="h-6 w-6 text-orange-600" />,
    title: 'Performance',
    description: 'Analise a velocidade de carregamento e outros fatores de desempenho que afetam o ranking.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Análise Completa do Seu Site</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Avalie todos os aspectos críticos que afetam o desempenho do seu site nos motores de busca e na IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {featuresList.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-100 bg-white rounded-lg hover:shadow-md transition-shadow">
              <div className="rounded-full bg-gray-50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="flex items-center gap-2">
            Ver mais detalhes
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

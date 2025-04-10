
import React from 'react';
import { Check, Zap, Shield, Users, Clock, Star, Award } from 'lucide-react';

const reasons = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: 'Análise Rápida',
    description: 'Resultados completos em segundos, sem necessidade de esperar horas por relatórios.'
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    title: 'Dados Precisos',
    description: 'Usamos APIs avançadas e modelos de IA de última geração para garantir resultados confiáveis.'
  },
  {
    icon: <Users className="h-6 w-6 text-green-500" />,
    title: 'Fácil de Usar',
    description: 'Interface intuitiva que permite a qualquer pessoa realizar análises profissionais.'
  }
];

const taglines = [
  { icon: <Award className="h-5 w-5 text-indigo-600" />, text: 'Feito para PMEs' },
  { icon: <Star className="h-5 w-5 text-amber-500" />, text: 'Focado em resultados' },
  { icon: <Clock className="h-5 w-5 text-emerald-500" />, text: 'Otimizado para ti' }
];

const benefits = [
  'Análise completa de SEO e IA em um só lugar',
  'Sugestões acionáveis para melhorar seu ranking',
  'Integração com os principais modelos de IA',
  'Dashboard personalizado para cada site',
  'Monitoramento contínuo das métricas',
  'Ferramentas de assistência para criação de conteúdo'
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Por Que Escolher o SEOaudit.pt</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Combinamos o melhor da análise SEO tradicional com otimização para os novos modelos de IA
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {taglines.map((tag, index) => (
              <div key={index} className="flex items-center bg-white py-2 px-4 rounded-full shadow-sm border border-gray-100">
                {tag.icon}
                <span className="ml-2 font-medium">{tag.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="p-6 border border-gray-100 rounded-lg bg-white hover:shadow-md transition-shadow">
              <div className="rounded-full bg-gray-50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                {reason.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-indigo-50 p-8 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">Principais Benefícios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 flex items-center justify-center mr-3 mt-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

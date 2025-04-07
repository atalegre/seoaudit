
import React from 'react';
import { Search, BarChart, Bot, LineChart, Sparkles, ListChecks } from 'lucide-react';

const features = [
  {
    title: 'SEO Score',
    description: 'Análise técnica completa com métricas de Core Web Vitals, estrutura e performance.',
    icon: <BarChart className="h-6 w-6 text-blue-600" />
  },
  {
    title: 'AIO Score',
    description: 'Avaliação de como os modelos de inteligência artificial interpretam seu conteúdo.',
    icon: <Sparkles className="h-6 w-6 text-purple-600" />
  },
  {
    title: 'LLM Presence',
    description: 'Verificação da presença do seu site em modelos como ChatGPT e Gemini.',
    icon: <Bot className="h-6 w-6 text-indigo-600" />
  },
  {
    title: 'Keyword Tracker',
    description: 'Acompanhamento do ranking das suas palavras-chave nos motores de busca.',
    icon: <LineChart className="h-6 w-6 text-green-600" />
  },
  {
    title: 'Writer Assistant',
    description: 'IA que sugere conteúdo otimizado para SEO e LLMs com base nas suas keywords.',
    icon: <Search className="h-6 w-6 text-orange-600" />
  },
  {
    title: 'Recomendações',
    description: 'Lista priorizada de melhorias para aumentar sua visibilidade online.',
    icon: <ListChecks className="h-6 w-6 text-red-600" />
  },
];

const FeatureHighlights = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recursos da Plataforma</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramentas completas para análise e otimização do seu site
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="rounded-full bg-gray-50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;

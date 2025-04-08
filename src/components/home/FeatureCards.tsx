
import React from 'react';
import { BarChart3, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureCards = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Análise completa do seu site</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nossa ferramenta oferece uma visão abrangente do desempenho do seu site, tanto para SEO tradicional quanto para otimização de IA.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* SEO Analysis Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl transform group-hover:scale-[0.98] transition-all duration-300 opacity-90"></div>
            <div className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-lg transition-all duration-300 group-hover:translate-y-2 group-hover:translate-x-2">
              <div className="rounded-full bg-blue-50 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Análise SEO Completa</h3>
              <p className="text-gray-600 mb-6">
                Avalie a otimização técnica, velocidade, estrutura e metadata do seu site para maximizar a visibilidade nos motores de busca.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Análise de Core Web Vitals</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Verificação de meta tags</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Estrutura de headings</span>
                </li>
              </ul>
              
              <Button variant="link" className="p-0 flex items-center text-blue-600 hover:text-blue-700 font-medium" asChild>
                <a href="/como-funciona">
                  Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* AI Optimization Card */}
          <div className="relative group mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl transform group-hover:scale-[0.98] transition-all duration-300 opacity-90"></div>
            <div className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-lg transition-all duration-300 group-hover:translate-y-2 group-hover:translate-x-2">
              <div className="rounded-full bg-purple-50 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Otimização para IA</h3>
              <p className="text-gray-600 mb-6">
                Descubra como o ChatGPT e outros LLMs interpretam seu conteúdo e otimize-o para aparecer em resultados baseados em IA.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Monitoramento de menções em LLMs</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Detecção de informações incorretas</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Estruturação de conteúdo para IA</span>
                </li>
              </ul>
              
              <Button variant="link" className="p-0 flex items-center text-purple-600 hover:text-purple-700 font-medium" asChild>
                <a href="/sobre-aio">
                  Explorar recursos <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Dashboard Card */}
          <div className="relative group mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl transform group-hover:scale-[0.98] transition-all duration-300 opacity-90"></div>
            <div className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-lg transition-all duration-300 group-hover:translate-y-2 group-hover:translate-x-2">
              <div className="rounded-full bg-green-50 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Dashboard Profissional</h3>
              <p className="text-gray-600 mb-6">
                Acesse relatórios detalhados, ferramentas de otimização de conteúdo e monitore o progresso do seu site ao longo do tempo.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Recomendações personalizadas</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Histórico de análises</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm">Gerador de conteúdo com IA</span>
                </li>
              </ul>
              
              <Button variant="link" className="p-0 flex items-center text-green-600 hover:text-green-700 font-medium" asChild>
                <a href="/signin">
                  Acessar dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;

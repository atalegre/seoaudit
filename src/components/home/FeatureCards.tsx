
import React from 'react';
import { BarChart3, Sparkles, Zap, ArrowRight, Search, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const FeatureCards = () => {
  const { language } = useLanguage();
  
  // Helper function to get localized paths
  const getLocalizedPath = (ptPath: string, enPath: string) => {
    return language === 'pt' ? ptPath : enPath;
  };
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'pt' 
              ? 'Análise completa do seu site' 
              : 'Complete analysis of your website'
            }
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'pt'
              ? 'Nossa ferramenta oferece uma visão abrangente do desempenho do seu site, tanto para SEO tradicional quanto para otimização de IA.'
              : 'Our tool offers a comprehensive view of your website performance, both for traditional SEO and AI optimization.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* SEO Analysis Card */}
          <div className="group relative transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-blue-600/10 transform blur-xl transition-all duration-300 group-hover:scale-105"></div>
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden h-full transition-all duration-300 z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {language === 'pt' ? 'Análise SEO Completa' : 'Complete SEO Analysis'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'pt'
                    ? 'Avalie a otimização técnica, velocidade, estrutura e metadata do seu site para maximizar a visibilidade nos motores de busca.'
                    : 'Evaluate technical optimization, speed, structure and metadata of your site to maximize visibility in search engines.'
                  }
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Análise de Core Web Vitals' : 'Core Web Vitals Analysis'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Verificação de meta tags' : 'Meta tags verification'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Estrutura de headings' : 'Headings structure'}
                    </span>
                  </li>
                </ul>
                
                <Button variant="ghost" className="p-0 flex items-center text-blue-600 hover:text-blue-700 font-medium" asChild>
                  <Link to={getLocalizedPath('/como-funciona', '/how-it-works')}>
                    {language === 'pt' ? 'Saiba mais' : 'Learn more'} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* AI Optimization Card */}
          <div className="group relative transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-purple-600/10 transform blur-xl transition-all duration-300 group-hover:scale-105"></div>
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden h-full transition-all duration-300 z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {language === 'pt' ? 'Otimização para IA' : 'AI Optimization'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'pt'
                    ? 'Descubra como o ChatGPT e outros LLMs interpretam seu conteúdo e otimize-o para aparecer em resultados baseados em IA.'
                    : 'Discover how ChatGPT and other LLMs interpret your content and optimize it to appear in AI-based results.'
                  }
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Monitoramento de menções em LLMs' : 'LLM mentions monitoring'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Detecção de informações incorretas' : 'Incorrect information detection'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Estruturação de conteúdo para IA' : 'Content structuring for AI'}
                    </span>
                  </li>
                </ul>
                
                <Button variant="ghost" className="p-0 flex items-center text-purple-600 hover:text-purple-700 font-medium" asChild>
                  <Link to={getLocalizedPath('/guias', '/guides')}>
                    {language === 'pt' ? 'Explorar recursos' : 'Explore resources'} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dashboard Card */}
          <div className="group relative transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600/20 to-green-600/10 transform blur-xl transition-all duration-300 group-hover:scale-105"></div>
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden h-full transition-all duration-300 z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                  <Bot className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {language === 'pt' ? 'Dashboard Profissional' : 'Professional Dashboard'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'pt'
                    ? 'Acesse relatórios detalhados, ferramentas de otimização de conteúdo e monitore o progresso do seu site ao longo do tempo.'
                    : 'Access detailed reports, content optimization tools and monitor your site\'s progress over time.'
                  }
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Recomendações personalizadas' : 'Personalized recommendations'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Histórico de análises' : 'Analysis history'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm">
                      {language === 'pt' ? 'Gerador de conteúdo com IA' : 'AI content generator'}
                    </span>
                  </li>
                </ul>
                
                <Button variant="ghost" className="p-0 flex items-center text-green-600 hover:text-green-700 font-medium" asChild>
                  <Link to="/signin">
                    {language === 'pt' ? 'Acessar dashboard' : 'Access dashboard'} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;

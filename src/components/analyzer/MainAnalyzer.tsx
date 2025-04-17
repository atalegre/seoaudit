import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BarChart3, Sparkles, Zap, CheckCircle, Shield, Cpu } from 'lucide-react';
import { useAnalyzerRedirect } from '@/hooks/useAnalyzerRedirect';

const MainAnalyzer = () => {
  const [url, setUrl] = useState('');
  const { isAnalyzing, handleAnalyzeAndRedirect } = useAnalyzerRedirect();
  
  const validateUrl = (inputUrl: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return pattern.test(inputUrl);
  };
  
  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }
    
    handleAnalyzeAndRedirect(url.trim());
  };
  
  return (
    <section className="pt-16 pb-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Análise Completa de SEO e <span className="text-blue-600">Otimização para IA</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Descubra como o seu site se comporta nos motores de busca e nos novos modelos de inteligência artificial com uma análise profunda e gratuita.
          </p>
          
          <form onSubmit={handleAnalysis} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-10" data-analyze-form="true">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Digite o URL do seu site (ex: seusite.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 pl-12 pr-4 text-base rounded-lg"
                disabled={isAnalyzing}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 text-lg flex items-center gap-2" 
              size="lg" 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>Analisando<span className="loading-dots">...</span></>
              ) : (
                <>Analisar site <ArrowRight className="h-5 w-5" /></>
              )}
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mb-10">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              Análise rápida e gratuita
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
              Sem necessidade de registo
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
              Resultados instantâneos
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-full bg-blue-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise SEO</h3>
            <p className="text-gray-600">Avaliação técnica completa do seu site com métricas de Core Web Vitals, estrutura e performance.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Avaliação de velocidade em mobile e desktop</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Análise de meta tags e estrutura de heading</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Verificação de otimização para mobile</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-full bg-purple-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise para IA</h3>
            <p className="text-gray-600">Descubra como o ChatGPT e outros LLMs interpretam o seu conteúdo e como melhorar sua visibilidade.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Análise de clareza e estrutura do conteúdo</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Identificação de tópicos principais</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Detecção de áreas confusas para IA</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-full bg-green-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboard Completo</h3>
            <p className="text-gray-600">Acesso a dashboard completo com análises detalhadas, sugestões de melhoria e ferramentas avançadas.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Monitorização contínua e recomendações</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Ferramentas de criação de conteúdo</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Relatórios detalhados com pontuações</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Nosso Dashboard Pro inclui</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="rounded-full bg-blue-50 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Monitorização contínua</h3>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-green-50 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium">Gerador de conteúdo IA</h3>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-yellow-50 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-medium">Análise competitiva</h3>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-purple-50 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium">Pesquisa de palavras-chave</h3>
            </div>
          </div>
          
          <Button className="mt-12" size="lg" asChild>
            <a href="/signin">Criar Conta Gratuita</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MainAnalyzer;

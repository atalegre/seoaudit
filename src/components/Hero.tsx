
import React, { useState } from 'react';
import { Search, Sparkles, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Por favor, insira um URL válido');
      return;
    }
    
    setIsLoading(true);
    
    // Format URL if needed
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // Save URL to localStorage
    localStorage.setItem('lastAnalyzedUrl', formattedUrl);
    
    // Extract domain and create project ID
    const domain = extractDomainFromUrl(formattedUrl);
    const projectId = `${domain}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Simulação de análise rápida
    setTimeout(() => {
      // Verificar se estamos em desenvolvimento ou produção
      const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname.includes('lovable');
      
      if (isDevelopment) {
        // Para ambiente de desenvolvimento
        window.location.href = `/suite?url=${encodeURIComponent(formattedUrl)}&projectId=${projectId}`;
      } else {
        // Para produção - redireciona para o subdomínio suite
        window.location.href = `https://suite.seoaudit.pt/projeto/${projectId}?url=${encodeURIComponent(formattedUrl)}`;
      }
    }, 1500);
  };
  
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white pt-16 pb-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2" />
            Análise completa para SEO e Inteligência Artificial
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 md:leading-tight">
            Otimize seu site para <span className="text-blue-600">Google</span> e <span className="text-purple-600">IA</span> com uma análise inteligente
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra como melhorar a visibilidade do seu site tanto nos motores de busca tradicionais quanto nos novos modelos de inteligência artificial com nossa análise abrangente.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-3 md:gap-2 mb-10" data-analyze-form="true">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="www.exemplo.pt"
                className="w-full h-14 pl-12 rounded-lg text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button type="submit" className="h-14 px-8 text-lg" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>Analisando<span className="loading-dots">...</span></>
              ) : 'Analisar gratuitamente'}
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              Análise técnica profunda
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
              Pontuação SEO e AIO
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
              Recomendações personalizadas
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature cards with improved content */}
      <div className="container px-4 mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="rounded-full bg-blue-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise SEO Completa</h3>
            <p className="text-gray-600 flex-grow">Avalie a otimização técnica, velocidade, estrutura e metadata do seu site para maximizar a visibilidade nos motores de busca.</p>
            <Button variant="link" className="mt-4 p-0 justify-start text-blue-600 hover:text-blue-700" asChild>
              <a href="/como-funciona">
                Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="rounded-full bg-purple-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Otimização para IA</h3>
            <p className="text-gray-600 flex-grow">Descubra como o ChatGPT e outros LLMs interpretam seu conteúdo e otimize-o para aparecer em resultados baseados em IA.</p>
            <Button variant="link" className="mt-4 p-0 justify-start text-purple-600 hover:text-purple-700" asChild>
              <a href="/glossario">
                Explorar glossário AIO <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="rounded-full bg-green-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboard Profissional</h3>
            <p className="text-gray-600 flex-grow">Acesse relatórios detalhados, ferramentas de otimização de conteúdo e monitore o progresso do seu site ao longo do tempo.</p>
            <Button variant="link" className="mt-4 p-0 justify-start text-green-600 hover:text-green-700" asChild>
              <a href="/signin">
                Acessar dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

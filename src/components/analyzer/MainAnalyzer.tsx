import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BarChart3, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';

const MainAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const validateUrl = (inputUrl: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return pattern.test(inputUrl);
  };
  
  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format URL if needed
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    if (!validateUrl(formattedUrl)) {
      toast.error("Por favor, insira um URL válido");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Save URL to localStorage for easy access in dashboard
      localStorage.setItem('lastAnalyzedUrl', formattedUrl);
      
      // Extract domain for display purposes
      const domain = extractDomainFromUrl(formattedUrl);
      console.log(`Iniciando análise para: ${domain}`);
      
      // Simulação de um breve processamento antes do redirecionamento
      setTimeout(() => {
        // Gerar um ID de projeto baseado no domínio e timestamp
        const projectId = `${domain}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');
        
        // Check if we're in production or development environment
        const isProd = window.location.hostname === 'seoaudit.pt';
        
        if (isProd) {
          // For production - redirect to the suite subdomain
          window.location.href = `https://suite.seoaudit.pt/projeto/${projectId}?url=${encodeURIComponent(formattedUrl)}`;
        } else {
          // For development - redirect to the local dashboard
          window.location.href = `/dashboard/client?url=${encodeURIComponent(formattedUrl)}&projectId=${projectId}`;
        }
      }, 1500); // Aguarda 1.5 segundos para simular análise inicial
      
    } catch (error) {
      console.error('Erro na análise:', error);
      toast.error("Ocorreu um erro ao iniciar a análise");
      setIsAnalyzing(false);
    }
  };
  
  return (
    <section className="pt-12 pb-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Análise Completa de SEO e <span className="text-blue-600">Otimização para IA</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Descubra como o seu site se comporta nos motores de busca e nos novos modelos de inteligência artificial com uma análise profunda e gratuita.
          </p>
          
          <form onSubmit={handleAnalysis} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-10">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-full bg-blue-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise SEO</h3>
            <p className="text-gray-600">Avaliação técnica completa do seu site com métricas de Core Web Vitals, estrutura e performance.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-full bg-purple-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise para IA</h3>
            <p className="text-gray-600">Descubra como o ChatGPT e outros LLMs interpretam o seu conteúdo e como melhorar sua visibilidade.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-full bg-green-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboard Completo</h3>
            <p className="text-gray-600">Acesso a dashboard completo com análises detalhadas, sugestões de melhoria e ferramentas avançadas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainAnalyzer;

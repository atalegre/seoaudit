
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Por favor, insira um URL válido');
      return;
    }
    setIsLoading(true);
    navigate(`/results?url=${encodeURIComponent(url)}`);
  };
  
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white pt-10 pb-12 md:pt-16 md:pb-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2" />
            Ferramenta gratuita de análise para SEO e IA
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 md:leading-tight">
            O seu site está otimizado para o <span className="text-blue-600">Google</span> e para a <span className="text-purple-600">IA</span>?
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Analise gratuitamente o seu site e descubra como melhorar a sua presença digital nos motores de busca e nos novos modelos de inteligência artificial.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-3 md:gap-2 mb-10">
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
              {isLoading ? 'Analisando...' : 'Analisar agora'}
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
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
      </div>
      
      {/* Floating cards */}
      <div className="container px-4 mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="rounded-full bg-blue-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise SEO</h3>
            <p className="text-gray-600 flex-grow">Avalie a otimização técnica do seu site para motores de busca como Google.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="rounded-full bg-purple-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise AIO</h3>
            <p className="text-gray-600 flex-grow">Verifique se o seu conteúdo está otimizado para modelos de inteligência artificial.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="rounded-full bg-green-50 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-gray-600 flex-grow">Teste a velocidade do seu site e a experiência do utilizador em dispositivos móveis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

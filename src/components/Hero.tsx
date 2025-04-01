
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, BarChart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    if (!url.trim() || !isValidUrl(url)) {
      toast.error('Por favor, insira um URL válido');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate analysis process (will be replaced with actual API calls)
    setTimeout(() => {
      setIsLoading(false);
      // Encode the URL and pass it to the results page
      navigate(`/results?url=${encodeURIComponent(url)}`);
    }, 1500);
  };
  
  const isValidUrl = (urlString: string) => {
    try {
      // Add protocol if missing
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = 'https://' + urlString;
      }
      
      new URL(urlString);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  return (
    <div className="container px-4 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in">
          O seu site está otimizado para o Google e para a IA?
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl animate-fade-in" style={{ animationDelay: '100ms' }}>
          Analise gratuitamente o seu site e descubra como melhorar a sua presença nos motores de busca e nos modelos de IA.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-xl animate-fade-in flex flex-col gap-4 md:flex-row md:gap-2" style={{ animationDelay: '200ms' }}>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="www.exemplo.pt"
              className="w-full h-12 pl-10"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Button type="submit" className="h-12 px-6" disabled={isLoading}>
            {isLoading ? (
              <>Analisando...</>
            ) : (
              <>Analisar agora gratuitamente</>
            )}
          </Button>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-3xl animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col items-center p-4 text-center">
            <div className="p-2 rounded-full bg-gray-100 mb-4">
              <BarChart className="h-6 w-6 text-seo" />
            </div>
            <p className="text-sm">Receba duas auditorias: SEO + AIO</p>
          </div>
          
          <div className="flex flex-col items-center p-4 text-center">
            <div className="p-2 rounded-full bg-gray-100 mb-4">
              <Zap className="h-6 w-6 text-aio" />
            </div>
            <p className="text-sm">Descubra como os motores de busca e as IAs entendem o seu site</p>
          </div>
          
          <div className="flex flex-col items-center p-4 text-center">
            <div className="p-2 rounded-full bg-gray-100 mb-4">
              <Search className="h-6 w-6 text-gray-800" />
            </div>
            <p className="text-sm">100% gratuito, sem compromisso</p>
          </div>
        </div>
        
        {/* Three additional bullet points */}
        <div className="w-full max-w-3xl mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-sm">Obtenha relatórios detalhados sobre os pontos fortes e fracos do seu site</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-sm">Receba recomendações personalizadas para melhorar a sua classificação nas pesquisas</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-sm">Acompanhe o progresso do seu site ao longo do tempo com análises periódicas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

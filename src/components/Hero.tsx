
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Componente otimizado para LCP
const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    if (!url.trim()) {
      toast.error('Por favor, insira um URL válido');
      return;
    }
    
    setIsLoading(true);
    navigate(`/results?url=${encodeURIComponent(url)}`);
  };
  
  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          O seu site está otimizado para o Google e para a IA?
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
          Analise gratuitamente o seu site e descubra como melhorar a sua presença nos motores de busca e nos modelos de IA.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-3 md:flex-row md:gap-2">
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
            {isLoading ? 'Analisando...' : 'Analisar agora'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Hero;

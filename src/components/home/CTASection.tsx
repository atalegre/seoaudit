
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';

const CTASection = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Por favor, insira um URL válido');
      return;
    }
    
    setIsAnalyzing(true);
    
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
        // Para produção - redireciona para o subdomínio suite em uma nova aba
        const suiteUrl = `https://suite.seoaudit.pt/projeto/${projectId}?url=${encodeURIComponent(formattedUrl)}`;
        window.open(suiteUrl, '_blank');
      }
    }, 1500);
  };
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar sua presença digital?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Analise seu site agora e descubra como melhorar seu ranking nos motores de busca e nos modelos de IA. Acesse todas as ferramentas na sua suite personalizada.
          </p>
          
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row mb-6 gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Digite o URL do seu site"
                className="h-12 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isAnalyzing}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            </div>
            <Button 
              type="submit" 
              className="h-12 font-medium bg-white text-blue-700 hover:bg-gray-100"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>Analisando<span className="loading-dots">...</span></>
              ) : (
                <>Analisar agora</>
              )}
            </Button>
          </form>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => window.location.href = '/como-funciona'}
            >
              Saiba mais <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/80">
            Sem necessidade de cadastro. Resultados instantâneos no seu dashboard.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

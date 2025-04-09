
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { language } = useLanguage();
  
  const getLocalizedPath = (ptPath: string, enPath: string) => {
    return language === 'pt' ? ptPath : enPath;
  };
  
  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error(language === 'pt' ? 'Por favor, insira um URL válido' : 'Please enter a valid URL');
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
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {language === 'pt' 
              ? 'Pronto para transformar sua presença digital?' 
              : 'Ready to transform your digital presence?'
            }
          </h2>
          <p className="text-xl mb-10 text-white/90">
            {language === 'pt'
              ? 'Analise seu site agora e descubra como melhorar seu ranking nos motores de busca e nos modelos de IA. Acesse todas as ferramentas na sua suite personalizada.'
              : 'Analyze your site now and discover how to improve your ranking in search engines and AI models. Access all tools in your personalized suite.'
            }
          </p>
          
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row mb-8 gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={language === 'pt' ? "Digite o URL do seu site" : "Enter your website URL"}
                className="h-14 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isAnalyzing}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            </div>
            <Button 
              type="submit" 
              className="h-14 font-medium bg-white text-indigo-700 hover:bg-gray-100"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>{language === 'pt' ? "Analisando" : "Analyzing"}<span className="loading-dots">...</span></>
              ) : (
                language === 'pt' ? 'Analisar agora' : 'Analyze now'
              )}
            </Button>
          </form>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10"
              asChild
            >
              <Link to={getLocalizedPath('/como-funciona', '/how-it-works')}>
                {language === 'pt' ? 'Saiba mais' : 'Learn more'} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/80">
            {language === 'pt'
              ? 'Sem necessidade de cadastro. Resultados instantâneos no seu dashboard.'
              : 'No registration required. Instant results in your dashboard.'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

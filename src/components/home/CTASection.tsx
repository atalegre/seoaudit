
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Play } from 'lucide-react';
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-10 md:p-14">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {language === 'pt' 
                ? 'Pronto para transformar sua presença digital?' 
                : 'Ready to transform your digital presence?'
              }
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {language === 'pt'
                ? 'Analise seu site agora e descubra como melhorar seu ranking nos motores de busca e nos modelos de IA.'
                : 'Analyze your site now and discover how to improve your ranking in search engines and AI models.'
              }
            </p>
            
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row mb-6 gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={language === 'pt' ? "Digite o URL do seu site" : "Enter your website URL"}
                  className="h-14 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isAnalyzing}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              </div>
              <Button 
                type="submit" 
                className="h-14 font-medium bg-white text-indigo-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>{language === 'pt' ? "Analisando" : "Analyzing"}<span className="loading-dots">...</span></>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    {language === 'pt' ? 'Analisar agora' : 'Analyze now'}
                  </>
                )}
              </Button>
            </form>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button 
                variant="outline" 
                className="bg-transparent border-white/30 text-white hover:bg-white/10 flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {language === 'pt' ? 'Ver demo' : 'Watch demo'}
              </Button>
            </div>
            
            <p className="mt-2 text-sm text-white/80">
              {language === 'pt'
                ? 'Verifica o SEO do teu site em segundos – sem registo necessário.'
                : 'Check your website SEO in seconds – no registration required.'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

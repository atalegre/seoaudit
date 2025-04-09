
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error(language === 'pt' ? 'Por favor, insira um URL válido' : 'Please enter a valid URL');
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
    <div className="relative bg-gradient-to-b from-blue-50 via-indigo-50 to-white py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              {language === 'pt' ? (
                <>Otimize seu site para <span className="text-blue-600">Google</span> e <span className="text-purple-600">Inteligência Artificial</span></>
              ) : (
                <>Optimize your website for <span className="text-blue-600">Google</span> and <span className="text-purple-600">AI</span></>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 lg:pr-8">
              {language === 'pt'
                ? 'Descubra como melhorar a visibilidade do seu site tanto nos motores de busca tradicionais quanto nos novos modelos de inteligência artificial.'
                : 'Discover how to improve your website visibility in both traditional search engines and new artificial intelligence models.'}
            </p>
            
            <form onSubmit={handleSubmit} data-analyze-form="true" className="flex flex-col sm:flex-row gap-3 mb-8 max-w-md mx-auto lg:mx-0">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={language === 'pt' ? "www.exemplo.pt" : "www.example.com"}
                  className="h-14 pl-12 text-lg rounded-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button 
                type="submit" 
                className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium rounded-lg" 
                size="lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>{language === 'pt' ? "Analisando" : "Analyzing"}<span className="loading-dots">...</span></>
                ) : (
                  language === 'pt' ? 'Analisar grátis' : 'Analyze for free'
                )}
              </Button>
            </form>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span>{language === 'pt' ? 'Análise técnica completa' : 'Complete technical analysis'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                <span>{language === 'pt' ? 'Pontuação SEO e AIO' : 'SEO and AIO Score'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                <span>{language === 'pt' ? 'Recomendações personalizadas' : 'Personalized recommendations'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-4 max-w-md mx-auto">
              <img 
                src="/lovable-uploads/50c418bb-5a2e-4af3-b3b9-a03697b89e44.png" 
                alt="SEO Audit Dashboard" 
                className="w-full h-auto rounded-lg"
              />
              
              {/* Feature highlight cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100 transform -rotate-3 z-20">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">+</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{language === 'pt' ? 'SEO Score' : 'SEO Score'}</div>
                    <div className="text-xs text-green-600 font-medium">92/100</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100 transform rotate-3 z-20">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">AI</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{language === 'pt' ? 'AIO Score' : 'AIO Score'}</div>
                    <div className="text-xs text-purple-600 font-medium">87/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

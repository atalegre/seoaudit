
import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  
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
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-24 lg:py-32">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-40 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            {language === 'pt' ? (
              <>Otimize seu site para <span className="text-blue-600">Google</span> e <span className="text-purple-600">IA</span></>
            ) : (
              <>Optimize your website for <span className="text-blue-600">Google</span> and <span className="text-purple-600">AI</span></>
            )}
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl">
            {language === 'pt'
              ? 'Descubra como melhorar a visibilidade do seu site tanto nos motores de busca tradicionais quanto nos novos modelos de inteligência artificial.'
              : 'Discover how to improve your website visibility in both traditional search engines and new artificial intelligence models.'}
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col sm:flex-row gap-3 mb-10" data-analyze-form="true">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={language === 'pt' ? "www.exemplo.pt" : "www.example.com"}
                className="w-full h-14 pl-12 rounded-lg text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button type="submit" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>{language === 'pt' ? "Analisando" : "Analyzing"}<span className="loading-dots">...</span></>
              ) : (
                language === 'pt' ? 'Analisar gratuitamente' : 'Analyze for free'
              )}
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span>{language === 'pt' ? 'Análise técnica profunda' : 'Deep technical analysis'}</span>
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
          
          <div className="mt-10 max-w-5xl w-full">
            <div className="relative mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              <img 
                src="/lovable-uploads/50c418bb-5a2e-4af3-b3b9-a03697b89e44.png" 
                alt="SEO Audit Dashboard" 
                className="w-full h-auto"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-5 -left-5 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20 w-64 transform -rotate-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-lg font-bold">+</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{language === 'pt' ? 'Análise finalizada' : 'Analysis completed'}</div>
                    <div className="text-xs text-gray-500">seoaudit.pt</div>
                  </div>
                </div>
                <div className="mt-2 text-center bg-green-50 rounded-lg py-1 text-xs text-green-600 font-medium">
                  {language === 'pt' ? 'Pontuação SEO: 92/100' : 'SEO Score: 92/100'}
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20 w-56 transform rotate-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="font-medium text-sm">{language === 'pt' ? 'Otimização IA' : 'AI Optimization'}</div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {language === 'pt' 
                    ? 'Presença nos LLMs melhorada em 35%' 
                    : 'LLM presence improved by 35%'}
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

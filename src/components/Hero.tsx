
import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
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
    <div className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-white z-0"></div>
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-7/12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Otimize seu site para <span className="text-blue-600">Google</span> e <span className="text-purple-600">IA</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Descubra como melhorar a visibilidade do seu site tanto nos motores de busca tradicionais quanto nos novos modelos de inteligência artificial.
              </p>
              
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 mb-10" data-analyze-form="true">
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
                <Button type="submit" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>Analisando<span className="loading-dots">...</span></>
                  ) : 'Analisar gratuitamente'}
                </Button>
              </form>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <span>Análise técnica profunda</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                  <span>Pontuação SEO e AIO</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                  <span>Recomendações personalizadas</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Confiado por mais de 1.400 utilizadores</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">4.8/5 (344 avaliações)</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-5/12">
              <div className="relative">
                {/* Main image - mockup of application */}
                <div className="relative z-10 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <img 
                    src="/lovable-uploads/50c418bb-5a2e-4af3-b3b9-a03697b89e44.png" 
                    alt="SEO Audit Dashboard" 
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Floating notification card */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20 w-64 transform -rotate-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 text-lg font-bold">+</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Análise finalizada</div>
                      <div className="text-xs text-gray-500">seusite.com.br</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center bg-green-50 rounded-lg py-1 text-xs text-green-600 font-medium">
                    Pontuação SEO: 92/100
                  </div>
                </div>
                
                {/* Floating success card */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20 w-56 transform rotate-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="font-medium text-sm">Otimização IA</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Presença nos LLMs melhorada em 35%
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

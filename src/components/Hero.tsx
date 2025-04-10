
import React, { useState } from 'react';
import { useAnalyzerRedirect } from '@/hooks/useAnalyzerRedirect';
import { Search, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const [url, setUrl] = useState('');
  const { isAnalyzing, handleAnalyzeAndRedirect } = useAnalyzerRedirect();
  const { user } = useUser();
  const isMobile = useIsMobile();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (url) {
      handleAnalyzeAndRedirect(url);
    }
  };

  return (
    <section className="w-full bg-white py-6 md:py-12 lg:py-16 flex items-center min-h-[60vh] md:min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Optimize your website for <span className="text-violet-600">Google</span> and <span className="text-blue-600">AI</span>
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600">
            Melhore sua visibilidade online com análises avançadas para motores de busca e modelos de IA.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:w-auto flex-1">
              <input
                type="url"
                placeholder="https://seusite.com"
                className="w-full pr-4 pl-10 py-3 border border-gray-300 rounded-md shadow-sm text-sm md:text-base"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 md:px-6 py-3 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 flex items-center justify-center gap-2 text-sm md:text-base"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                'Analisando...'
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  {isMobile ? 'Analisar site' : 'Analisar site grátis'}
                </>
              )}
            </button>
          </form>
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-500">
            Sem necessidade de registo. Resultados instantâneos.
          </p>
          
          <div className="mt-5 md:mt-6">
            <Button variant="outline" asChild className="flex items-center gap-2 text-sm">
              <Link to="/how-it-works">
                <Info className="h-4 w-4" />
                Ver mais detalhes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

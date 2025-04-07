
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();
  
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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              variant="default" 
              className="font-medium bg-white text-blue-700 hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              <Search className="mr-2 h-5 w-5" /> Analisar meu site
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/como-funciona')}
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

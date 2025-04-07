
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para melhorar sua presença digital?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Faça uma análise completa do seu site agora mesmo e descubra como aumentar sua visibilidade nos motores de busca e na IA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="font-medium"
              onClick={() => navigate('/')}
            >
              Analisar meu site
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/como-funciona')}
            >
              Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

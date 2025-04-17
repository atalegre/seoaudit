
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface FirstTimeExperienceProps {
  onStartAnalysis: () => void;
}

const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({ onStartAnalysis }) => {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bem-vindo à Suite SEO & AIO</h2>
      <p className="text-gray-600 mb-6">
        Comece analisando seu primeiro website para ver recomendações
        de otimização para mecanismos de busca e AI.
      </p>
      
      <Button onClick={onStartAnalysis} className="mx-auto">
        <Search className="mr-2 h-4 w-4" />
        Analisar Meu Website
      </Button>
    </div>
  );
};

export default FirstTimeExperience;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface EmptyDashboardStateProps {
  analyzeDomain: string;
  setAnalyzeDomain: (domain: string) => void;
}

const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ 
  analyzeDomain, 
  setAnalyzeDomain 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-4 py-10">
      <div className="max-w-md text-center space-y-5">
        <div className="bg-blue-50 text-blue-800 p-3 rounded-full inline-flex">
          <Search className="h-10 w-10" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight">
          Comece sua análise agora
        </h1>
        
        <p className="text-gray-500">
          Digite a URL do seu website para obter uma análise completa de SEO, 
          otimização para IA, e recomendações personalizadas.
        </p>
        
        <div className="pt-4">
          <Button 
            onClick={() => {
              // Scroll to URL input at the top
              const inputElement = document.getElementById('url-input');
              if (inputElement) {
                inputElement.focus();
                inputElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            size="lg"
          >
            <Search className="mr-2 h-4 w-4" />
            Analisar meu website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboardState;

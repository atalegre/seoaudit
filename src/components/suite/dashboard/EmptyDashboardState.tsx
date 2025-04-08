
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnalyzerRedirect } from '@/hooks/useAnalyzerRedirect';

interface EmptyDashboardStateProps {
  analyzeDomain: string;
  setAnalyzeDomain: (value: string) => void;
}

const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ 
  analyzeDomain, 
  setAnalyzeDomain 
}) => {
  const { isAnalyzing, handleAnalyzeAndRedirect } = useAnalyzerRedirect();

  const handleSubmitDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analyzeDomain) {
      return;
    }
    handleAnalyzeAndRedirect(analyzeDomain);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="rounded-full bg-blue-100 p-6 inline-flex">
        <Globe className="h-12 w-12 text-blue-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bem-vindo à Suite de Análise</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Para começar, insira o domínio do seu website para analisar sua presença online e otimizar seu desempenho.
        </p>
      </div>
      
      <form onSubmit={handleSubmitDomain} className="w-full max-w-md space-y-4">
        <div className="flex w-full max-w-md items-center space-x-2">
          <Input
            type="text"
            placeholder="www.seudominio.com"
            value={analyzeDomain}
            onChange={(e) => setAnalyzeDomain(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? "Analisando..." : "Analisar"}
            {!isAnalyzing && <Search className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
      
      <div className="border rounded-lg p-6 bg-gray-50 max-w-md w-full mt-8">
        <h3 className="text-lg font-medium mb-2">Por que analisar seu site?</h3>
        <ul className="text-sm text-muted-foreground text-left space-y-2">
          <li>• Melhore seu ranking nos motores de busca</li>
          <li>• Otimize para experiências com IA</li>
          <li>• Verifique sua presença online em diretórios</li>
          <li>• Identifique oportunidades de melhoria técnica</li>
          <li>• Acompanhe seu desempenho ao longo do tempo</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyDashboardState;

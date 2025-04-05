
import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AnalysisErrorViewProps {
  seoError: string | null;
  aioError: string | null;
  onReanalyze: () => void;
}

const AnalysisErrorView: React.FC<AnalysisErrorViewProps> = ({ 
  seoError, 
  aioError, 
  onReanalyze 
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in lcp-target">
        Resultados da análise
      </h1>
      
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Não foi possível obter dados reais</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Não conseguimos obter dados reais das APIs para a análise.</p>
          {seoError && <p><strong>Erro SEO:</strong> {seoError}</p>}
          {aioError && <p><strong>Erro AIO:</strong> {aioError}</p>}
          <p>Por favor, verifique se as chaves de API estão configuradas corretamente nas Configurações.</p>
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center mt-8">
        <button 
          onClick={onReanalyze}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Loader2 className="h-4 w-4 mr-2 inline" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default AnalysisErrorView;


import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
        <AlertTitle>Erro na API - Não foi possível obter dados reais</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Não conseguimos obter dados reais das APIs para a análise. São necessárias chaves de API válidas.</p>
          
          {seoError && (
            <div className="mt-2 p-3 bg-red-50 rounded-md border border-red-200">
              <p className="font-semibold">Erro na API Google PageSpeed Insights (SEO):</p>
              <p className="text-sm break-words">{seoError}</p>
            </div>
          )}
          
          {aioError && (
            <div className="mt-2 p-3 bg-red-50 rounded-md border border-red-200">
              <p className="font-semibold">Erro na API OpenAI (AIO):</p>
              <p className="text-sm break-words">{aioError}</p>
            </div>
          )}
          
          <div className="mt-4">
            <p className="font-semibold">Solução:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Configure a variável de ambiente <code>VITE_PAGESPEED_API_KEY</code> com sua chave da API PageSpeed Insights</li>
              <li>Configure a variável de ambiente <code>OPENAI_API_KEY</code> na função Edge do Supabase</li>
              <li>Verifique a validade das chaves de API e os limites de uso</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={onReanalyze}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default AnalysisErrorView;

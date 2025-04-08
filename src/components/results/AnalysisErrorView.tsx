
import React from 'react';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';
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
  // Check if the error relates to PageSpeed API key
  const isPageSpeedKeyError = seoError && (
    seoError.includes('VITE_PAGESPEED_API_KEY') || 
    seoError.includes('PageSpeed Insights API has not been used') ||
    seoError.includes('API has not been enabled')
  );
  
  // Extract project ID from error message if available
  let projectId = '';
  if (isPageSpeedKeyError && seoError) {
    const match = seoError.match(/project=(\d+)/);
    projectId = match ? match[1] : '';
  }
  
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
              
              {isPageSpeedKeyError && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <p className="text-sm font-medium">Para resolver o problema:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                    <li>Acesse o <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                      Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" />
                    </a></li>
                    <li>Crie um projeto ou selecione um existente</li>
                    <li>Ative a API PageSpeed Insights em "Biblioteca de APIs"
                      {projectId && (
                        <a 
                          href={`https://console.developers.google.com/apis/api/pagespeedonline.googleapis.com/overview?project=${projectId}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline inline-flex items-center"
                        >
                          Link direto <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </li>
                    <li>Crie uma chave de API na seção "Credenciais"</li>
                    <li>Copie a chave gerada e configure-a como variável de ambiente</li>
                  </ol>
                </div>
              )}
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
              <li>Configure a variável de ambiente <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_PAGESPEED_API_KEY</code> com sua chave da API PageSpeed Insights</li>
              <li>Configure a variável de ambiente <code className="bg-gray-100 px-1 py-0.5 rounded">OPENAI_API_KEY</code> na função Edge do Supabase</li>
              <li>Verifique a validade das chaves de API e os limites de uso</li>
              <li>Certifique-se de que a URL é válida e acessível publicamente</li>
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

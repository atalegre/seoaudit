
import React from 'react';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { getApiKey, isApiNotEnabledError } from '@/utils/api/pageInsights';

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
  const isPageSpeedKeyError = seoError && (
    seoError.includes('VITE_PAGESPEED_API_KEY') || 
    seoError.includes('não configurada') ||
    seoError.includes('Chave API PageSpeed') ||
    seoError.includes('API Key não configurada') ||
    seoError.includes('Chave API inválida') ||
    seoError.includes('Não configurada')
  );
  
  const isApiNotEnabled = seoError && isApiNotEnabledError(seoError);
  
  const isQuotaExceededError = seoError && (
    seoError.includes('quota') ||
    seoError.includes('cota') ||
    seoError.includes('rate limit') ||
    seoError.includes('limite de requisições')
  );
  
  const isNetworkError = seoError && (
    seoError.includes('network') ||
    seoError.includes('rede') ||
    seoError.includes('conexão') ||
    seoError.includes('fetch') ||
    seoError.includes('Timeout')
  );
  
  let projectId = '';
  if (seoError) {
    const match = seoError.match(/project=(\d+)/);
    projectId = match ? match[1] : '';
  }
  
  const activateApiLink = projectId 
    ? `https://console.developers.google.com/apis/api/pagespeedonline.googleapis.com/overview?project=${projectId}`
    : 'https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com';

  const apiKey = getApiKey();
  const apiKeyPrefix = apiKey ? apiKey.substring(0, 4) : 'Não configurada';
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 animate-fade-in lcp-target">
        Resultados da análise
      </h1>
      
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Erro na API - Não foi possível obter dados reais</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Não conseguimos obter dados reais da API Google PageSpeed Insights para a análise.</p>
          
          {seoError && (
            <div className="mt-2 p-3 bg-red-50 rounded-md border border-red-200">
              <p className="font-semibold">Erro na API Google PageSpeed Insights (SEO):</p>
              <p className="text-sm break-words">{seoError}</p>
              
              {isApiNotEnabled && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <p className="text-sm font-medium">A API PageSpeed Insights não está ativada!</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                    <li>Acesse o <a href={activateApiLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                      Google Cloud Console para ativar a API <ExternalLink className="h-3 w-3 ml-1" />
                    </a></li>
                    <li>Clique no botão "Ativar" ou "Enable"</li>
                    <li>Aguarde alguns minutos para a ativação se propagar</li>
                    <li>Retorne e tente novamente</li>
                  </ol>
                </div>
              )}
              
              {isPageSpeedKeyError && !isApiNotEnabled && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <p className="text-sm font-medium">Problema com a chave da API:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                    <li>Acesse o <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                      Google Cloud Console - Credenciais <ExternalLink className="h-3 w-3 ml-1" />
                    </a></li>
                    <li>Crie um projeto ou selecione um existente</li>
                    <li>Ative a API PageSpeed Insights em "Biblioteca de APIs"</li>
                    <li>Crie uma chave de API na seção "Credenciais"</li>
                    <li>Configure a chave como variável de ambiente VITE_PAGESPEED_API_KEY</li>
                  </ol>
                </div>
              )}
              
              {isQuotaExceededError && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <p className="text-sm font-medium">Cota de requisições excedida:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                    <li>Aguarde alguns minutos e tente novamente</li>
                    <li>Acesse o <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                      Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" />
                    </a> para aumentar sua cota</li>
                    <li>Considere usar uma chave API diferente</li>
                  </ol>
                </div>
              )}
              
              {isNetworkError && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <p className="text-sm font-medium">Problema de conexão ou timeout:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                    <li>Verifique sua conexão com a internet</li>
                    <li>A análise de sites muito grandes pode demorar mais do que o esperado</li>
                    <li>Tente novamente mais tarde ou analise um URL mais simples</li>
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
              <li>Status da sua chave API: {apiKey ? 
                <code className="bg-gray-100 px-1 py-0.5 rounded text-green-700">{apiKeyPrefix}...</code> : 
                <code className="bg-red-100 px-1 py-0.5 rounded text-red-700">Não configurada</code>}
              </li>
              <li>Configure a variável de ambiente <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_PAGESPEED_API_KEY</code> com sua chave Google API</li>
              <li>Verifique se você <span className="font-medium">ativou a API no console do Google Cloud</span></li>
              <li>Certifique-se de que a URL é válida e acessível publicamente</li>
              <li>Tente analisar URLs populares como "google.com" para testar se a API está funcionando</li>
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

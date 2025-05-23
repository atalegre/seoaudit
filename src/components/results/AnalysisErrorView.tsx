
import React from 'react';
import { AlertCircle, Loader2, ExternalLink, Key } from 'lucide-react';
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
  const apiKeySuffix = apiKey ? apiKey.substring(apiKey.length - 4) : '';
  
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
                  <p className="text-sm font-medium">Servidor: A chave API está configurada, mas ocorreu um erro:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                    <li>Verifique se a API PageSpeed Insights está ativada no Google Cloud Console</li>
                    <li>Certifique-se de que a chave API tem acesso à API PageSpeed Insights</li>
                    <li>Verifique os logs do servidor para mais detalhes sobre o erro</li>
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
              <li className="flex items-center">Status da chave API: 
                <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 ml-1 inline-flex items-center">
                  <Key className="h-3 w-3 mr-1" />
                  Protegida no servidor
                </code>
              </li>
              <li>Verifique se você <span className="font-medium">ativou a API no console do Google Cloud</span></li>
              <li>Certifique-se de que a URL é válida e acessível publicamente</li>
              <li>Tente analisar URLs populares como "google.com" para testar se a API está funcionando</li>
            </ul>
          </div>
          
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800">
            <p className="text-sm font-medium">Informação sobre a chave API:</p>
            
              <p className="text-xs mt-1">
                Este projeto está usando uma chave API configurada no servidor.
              </p>
            
            <p className="text-xs mt-1">
              A API PageSpeed Insights é uma API aberta da Google. Para garantir que funcione, você deve <a href={activateApiLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                ativar a API no Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" />
              </a> para esta chave.
            </p>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={onReanalyze}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          {/* Loader2 removed here as requested */}
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default AnalysisErrorView;

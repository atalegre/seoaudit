
/**
 * Creates a detailed error message based on the error type
 * @param url URL being analyzed
 * @param strategy Device strategy
 * @param error Error object or message
 * @param apiKey API key (will be partially masked)
 * @returns Formatted error message
 */
export function createDetailedErrorMessage(url: string, strategy: 'desktop' | 'mobile', error: any, apiKey?: string): string {
  // Log completo do erro para depuração
  console.error(`❌ Erro detalhado na API PageSpeed (${strategy}):`, error);
  
  // Base error message
  let errorMessage = `❌ Falha ao obter dados da API Google PageSpeed Insights para ${strategy}. `;

  // Add specific context based on error type
  if (!apiKey) {
    errorMessage += 'Chave API PageSpeed não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY';
  } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    errorMessage += 'Erro de rede ao conectar com a API. Verifique sua conexão à internet.';
  } else if (isApiNotEnabledError(error?.message || '')) {
    errorMessage += 'A API PageSpeed Insights não está ativada. Acesse o console do Google Cloud e ative-a para o projeto associado à sua chave API.';
  } else if (error?.message?.includes('Timeout')) {
    errorMessage += 'Timeout excedido ao conectar com a API. Tente novamente mais tarde.';
  } else if (error?.message?.includes('API key')) {
    errorMessage += 'Chave API inválida ou não autorizada. Verifique se a chave está correta e tem as permissões necessárias.';
  } else if (error?.message?.includes('quota')) {
    errorMessage += 'Cota de requisições excedida. Aguarde alguns minutos ou aumente sua cota no Google Cloud Console.';
  } else if (error?.message?.includes('Não configurada') || error?.message?.includes('não está definida')) {
    errorMessage += 'Chave API não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY com sua chave Google API.';
  } else if (error?.message?.includes('400')) {
    errorMessage += 'Erro 400: Requisição inválida. Verifique se a URL é válida e acessível publicamente.';
  } else if (error?.message?.includes('403')) {
    errorMessage += 'Erro 403: Acesso negado. Sua chave API pode estar restrita ou não ter as permissões adequadas.';
  } else if (error?.message?.includes('404')) {
    errorMessage += 'Erro 404: Recurso não encontrado. A URL que você está tentando analisar pode não existir.';
  } else if (error?.message?.includes('429')) {
    errorMessage += 'Erro 429: Muitas requisições. Você excedeu o limite de requisições permitidas. Aguarde alguns minutos.';
  } else if (error?.message?.includes('500') || error?.message?.includes('502') || error?.message?.includes('503')) {
    errorMessage += 'Erro do servidor Google. Os servidores do Google PageSpeed Insights estão enfrentando problemas. Tente novamente mais tarde.';
  } else {
    errorMessage += error?.message || 'Erro desconhecido';
  }

  // Add helpful advice
  errorMessage += '\n\nCertifique-se de que a URL é válida e acessível publicamente.';
  
  // Adicionar informação sobre a chave API
  if (apiKey) {
    const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
    errorMessage += `\nChave API usada (mascarada): ${maskedKey}`;
  }

  return errorMessage;
}

/**
 * Extracts error details from an HTTP response
 * @param response Fetch Response object
 * @returns Promise with error message
 */
export async function extractHttpErrorDetails(response: Response): Promise<string> {
  let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
  
  try {
    const errorData = await response.json();
    console.log('Dados de erro da resposta HTTP:', errorData);
    
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
      
      // Adicionar detalhes do projeto, se disponíveis
      if (errorData.error?.details) {
        const projectMatch = JSON.stringify(errorData.error.details).match(/project=(\d+)/);
        if (projectMatch) {
          errorMessage += ` (project=${projectMatch[1]})`;
        }
      }
    }
  } catch (e) {
    console.error('❌ Não foi possível processar resposta de erro:', e);
  }
  
  return errorMessage;
}

/**
 * Checks if error is related to API not being enabled
 * @param errorMessage Error message to check
 * @returns Boolean indicating if this is an API not enabled error
 */
export function isApiNotEnabledError(errorMessage: string): boolean {
  if (!errorMessage) return false;
  
  const apiNotEnabledPatterns = [
    'API has not been used',
    'API has not been enabled',
    'API not enabled',
    'has not been used in project',
    'has not been enabled in project',
    'não está ativada',
    'service not enabled',
    'The provided project ID',
    'enable it by visiting',
    'PagespeedService',
    'is not available',
    'is disabled',
    'has been disabled'
  ];
  
  return apiNotEnabledPatterns.some(pattern => errorMessage.toLowerCase().includes(pattern.toLowerCase()));
}

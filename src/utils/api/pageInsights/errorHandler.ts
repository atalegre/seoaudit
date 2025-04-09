
/**
 * Creates a detailed error message based on the error type
 * @param url URL being analyzed
 * @param strategy Device strategy
 * @param error Error object or message
 * @param apiKey API key (will be partially masked)
 * @returns Formatted error message
 */
export function createDetailedErrorMessage(url: string, strategy: 'desktop' | 'mobile', error: any, apiKey?: string): string {
  // Base error message
  let errorMessage = `❌ Falha ao obter dados da API Google PageSpeed Insights para ${strategy}. `;

  // Add specific context based on error type
  if (!apiKey) {
    errorMessage += 'Chave API PageSpeed não configurada. Configure a variável de ambiente VITE_PAGESPEED_API_KEY';
  } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    errorMessage += 'Erro de rede ao conectar com a API. Verifique sua conexão à internet.';
  } else if (error?.message?.includes('API has not been used') || error?.message?.includes('API has not been enabled')) {
    errorMessage += 'A API PageSpeed Insights não está ativada. Acesse o console do Google Cloud e ative-a para o projeto associado à sua chave API.';
  } else if (error?.message?.includes('Timeout')) {
    errorMessage += 'Timeout excedido ao conectar com a API. Tente novamente mais tarde.';
  } else {
    errorMessage += error?.message || 'Erro desconhecido';
  }

  // Add helpful advice
  errorMessage += '\n\nCertifique-se de que a URL é válida e acessível publicamente.';

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
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
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
  return (
    errorMessage.includes('API has not been used') || 
    errorMessage.includes('API has not been enabled') ||
    errorMessage.includes('API not enabled')
  );
}

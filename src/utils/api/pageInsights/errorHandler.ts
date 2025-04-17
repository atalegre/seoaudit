
/**
 * Create a detailed error message for PageSpeed Insights API failures
 * @param url URL being analyzed
 * @param strategy Device strategy (mobile/desktop)
 * @param error The error object
 * @param apiKey Optional API key for masking in messages
 * @returns Detailed error message
 */
export function createDetailedErrorMessage(url: string, strategy: 'mobile' | 'desktop', error: any, apiKey: string = ''): string {
  // Get browser information
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Create a standardized error message
  let errorMessage = `Erro ao analisar ${url} (${strategy}) - ${error.message || 'Erro desconhecido'}`;
  
  // Add helpful troubleshooting tips based on error
  if (error.message?.includes('quota')) {
    errorMessage += '. Cota de API excedida. Tente novamente mais tarde.';
  } else if (error.message?.includes('API key')) {
    errorMessage += '. Problema com a chave da API PageSpeed.';
  } else if (error.message?.includes('CORS')) {
    errorMessage += '. Erro de CORS. Isso geralmente ocorre devido a restrições do navegador.';
  } else if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
    errorMessage += '. A solicitação expirou. O site pode ser muito grande ou a conexão está lenta.';
  } else if (error.message?.includes('network')) {
    errorMessage += '. Erro de rede. Verifique sua conexão com a internet.';
  }
  
  // Add browser info for debugging
  errorMessage += `\nNavegador: ${userAgent.substring(0, 150)}${isMobile ? ' (Mobile)' : ' (Desktop)'}`;
  
  return errorMessage;
}

/**
 * Extract detailed error information from an HTTP response
 * @param response HTTP Response object
 * @returns Error message string
 */
export async function extractHttpErrorDetails(response: Response): Promise<string> {
  try {
    // Try to parse as JSON first
    const text = await response.text();
    try {
      const errorJson = JSON.parse(text);
      if (errorJson.error) {
        if (typeof errorJson.error === 'string') {
          return errorJson.error;
        } else if (errorJson.error.message) {
          return errorJson.error.message;
        } else {
          return JSON.stringify(errorJson.error);
        }
      }
      return text || `${response.status}: ${response.statusText}`;
    } catch {
      // If not JSON, return the text
      return text || `${response.status}: ${response.statusText}`;
    }
  } catch (error) {
    // If we can't read the response at all
    return `${response.status}: ${response.statusText}`;
  }
}

/**
 * Check if the error is related to API not being enabled
 * @param errorMessage Error message to check
 * @returns boolean indicating if error is about API not being enabled
 */
export function isApiNotEnabledError(errorMessage: string): boolean {
  const apiNotEnabledPatterns = [
    'API not enabled',
    'has not been used',
    'enable it',
    'developer console',
    'API',
    'not enabled',
    'project',
    'Service',
    'disabled'
  ];
  
  const lowercaseError = errorMessage.toLowerCase();
  // Check if at least 3 patterns are in the error message
  const matches = apiNotEnabledPatterns.filter(pattern => 
    lowercaseError.includes(pattern.toLowerCase())
  ).length;
  
  return matches >= 3;
}

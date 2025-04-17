
/**
 * Checks if the error message indicates that the API is not enabled
 * @param errorMessage Error message to check
 * @returns boolean indicating if the API is not enabled
 */
export function isApiNotEnabledError(errorMessage: string): boolean {
  return (
    errorMessage.includes('API not enabled') ||
    errorMessage.includes('API não ativada') ||
    errorMessage.includes('API not authorized') ||
    errorMessage.includes('API não autorizada') ||
    errorMessage.includes('RESOURCE_EXHAUSTED') ||
    errorMessage.includes('Enable the PageSpeed') ||
    errorMessage.includes('Ative a API PageSpeed')
  );
}

/**
 * Creates a detailed error message with instructions for troubleshooting
 * @param url URL that was analyzed
 * @param strategy Device strategy
 * @param error Original error
 * @param apiKeyInfo API key information
 * @returns Detailed error message
 */
export function createDetailedErrorMessage(
  url: string, 
  strategy: 'desktop' | 'mobile', 
  error: Error, 
  apiKeyInfo: string
): string {
  // Extract the project ID from the error message if it exists
  let projectId = '';
  const projectMatch = error.message.match(/project=(\d+)/);
  if (projectMatch && projectMatch[1]) {
    projectId = projectMatch[1];
  }
  
  // Check if it's an API not enabled error
  const isNotEnabled = isApiNotEnabledError(error.message);
  
  // Build detailed error message
  let detailedMessage = `Erro ao analisar ${url} para ${strategy}. `;
  
  // Add specific message based on error type
  if (isNotEnabled) {
    detailedMessage += `A API PageSpeed Insights não está habilitada. Acesse o Console Google Cloud para ativá-la${projectId ? ' (project=' + projectId + ')' : ''}.`;
  } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
    detailedMessage += 'Cota de requisições excedida. Tente novamente mais tarde ou aumente sua cota no Console Google Cloud.';
  } else if (error.message.includes('key') || error.message.includes('chave')) {
    detailedMessage += `Problema com a chave API. Status da chave: ${apiKeyInfo}`;
  } else {
    detailedMessage += error.message;
  }
  
  return detailedMessage;
}

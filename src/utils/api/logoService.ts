
import { extractDomainFromUrl } from '../domainUtils';

/**
 * Fetches the site logo URL using the Clearbit Logo API
 * Serviço gratuito que não requer autenticação para uso básico
 */
export async function fetchSiteLogo(url: string): Promise<string | null> {
  try {
    const domain = extractDomainFromUrl(url);
    if (!domain) {
      console.warn('Could not extract domain from URL:', url);
      return null;
    }
    
    // Clearbit Logo API não requer autenticação para uso básico
    const apiUrl = `https://logo.clearbit.com/${domain}`;
    
    // Verificação simples se o logo existe
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      redirect: 'follow'
    });
    
    if (response.ok) {
      console.log(`Logo encontrado para ${domain}`);
      return apiUrl; // Retorna a URL do logo diretamente
    } else {
      console.warn(`Logo não encontrado para ${domain}:`, response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar logo do site:', error);
    return null;
  }
}

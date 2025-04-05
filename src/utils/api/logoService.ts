
import { extractDomainFromUrl } from '../domainUtils';

/**
 * Fetches the site logo URL using the Clearbit Logo API
 * Serviço gratuito que não requer autenticação para uso básico
 */
export async function fetchSiteLogo(url: string): Promise<string | null> {
  try {
    // Log para depuração - ver a URL recebida
    console.log('Tentando obter logo para URL:', url);
    
    const domain = extractDomainFromUrl(url);
    if (!domain) {
      console.warn('Não foi possível extrair domínio da URL:', url);
      return null;
    }
    
    console.log('Domínio extraído:', domain);
    
    // Clearbit Logo API não requer autenticação para uso básico
    const apiUrl = `https://logo.clearbit.com/${domain}`;
    
    // Verificar primeiro se o logo existe com uma solicitação HEAD
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      redirect: 'follow',
      // Para evitar problemas com CORS
      mode: 'no-cors' 
    });
    
    // Como estamos usando no-cors, não podemos verificar o status,
    // então vamos assumir que está disponível e deixar a imagem tentar carregar
    console.log(`Logo para ${domain}: ${apiUrl}`);
    return apiUrl;
  } catch (error) {
    console.error('Erro ao buscar logo do site:', error);
    return null;
  }
}

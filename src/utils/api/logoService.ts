
import { extractDomainFromUrl } from '../domainUtils';

/**
 * Fetches the site logo URL using the Clearbit Logo API
 * Serviço gratuito que não requer autenticação para uso básico
 */
export async function fetchSiteLogo(url: string): Promise<string | null> {
  try {
    // Log para depuração - ver a URL recebida
    console.log('🔍 Tentando obter logo para URL:', url);
    
    const domain = extractDomainFromUrl(url);
    if (!domain) {
      console.warn('⚠️ Não foi possível extrair domínio da URL:', url);
      return null;
    }
    
    console.log('🌐 Domínio extraído:', domain);
    
    // Correção: usar URL direta para o logo sem tentar fazer HEAD request
    // que estava causando erros de CORS
    const apiUrl = `https://logo.clearbit.com/${domain}`;
    console.log(`🖼️ Logo URL: ${apiUrl}`);
    
    // Retornar a URL diretamente sem verificações prévias
    return apiUrl;
  } catch (error) {
    console.error('❌ Erro ao buscar logo do site:', error);
    return null;
  }
}

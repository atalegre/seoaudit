
import { extractDomainFromUrl } from '../domainUtils';

/**
 * Fetches the site logo URL using Favicon API
 */
export async function fetchSiteLogo(url: string): Promise<string | null> {
  try {
    // Log for debugging
    console.log('🔍 Tentando obter logo para URL:', url);
    
    const domain = extractDomainFromUrl(url);
    if (!domain) {
      console.warn('⚠️ Não foi possível extrair domínio da URL:', url);
      return null;
    }
    
    console.log('🌐 Domínio extraído:', domain);
    
    // Use Google's favicon service instead of Clearbit
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    console.log(`🖼️ Logo URL construída: ${logoUrl}`);
    
    return logoUrl;
  } catch (error) {
    console.error('❌ Erro ao buscar logo do site:', error);
    return null;
  }
}

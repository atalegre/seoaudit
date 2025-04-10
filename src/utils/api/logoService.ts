
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
    
    // Construir URL do logo manualmente para garantir formato correto
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    console.log(`🖼️ Logo URL construída: ${logoUrl}`);
    
    // Verificar se a URL do logo está acessível
    try {
      // Testar a URL do logo com uma solicitação HEAD para verificar se ela existe
      const response = await fetch(logoUrl, { method: 'HEAD', mode: 'no-cors' });
      console.log(`✅ Logo verificado, status: HEAD request enviada`);
      return logoUrl;
    } catch (logoError) {
      // Mesmo se a verificação falhar, ainda retornamos a URL
      // Isso é porque o componente de imagem pode lidar com fallbacks
      console.warn(`⚠️ Aviso na verificação do logo:`, logoError);
      return logoUrl; // Retornar mesmo assim, deixar o componente de imagem lidar com fallbacks
    }
  } catch (error) {
    console.error('❌ Erro ao buscar logo do site:', error);
    return null;
  }
}

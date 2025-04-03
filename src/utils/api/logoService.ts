
import { toast } from 'sonner';
import { getApiKey } from './index';

interface LogoResponse {
  logo_url: string;
  status: 'success' | 'error';
  message?: string;
}

/**
 * Busca o logo de um site através da API logo.dev
 * @param url URL do site
 * @returns URL do logo ou null em caso de erro
 */
export async function fetchSiteLogo(url: string): Promise<string | null> {
  try {
    // Normalizar a URL se necessário
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname;
    
    console.log(`Buscando logo para o domínio: ${domain}`);
    
    // Obter a chave da API das configurações
    const apiKey = await getApiKey('logoApiKey') || 'sk_RM22KfReRJ2LjotDAYgcxA';
    
    if (!apiKey) {
      console.error('API key do logo.dev não encontrada nas configurações');
      return null;
    }
    
    const response = await fetch(`https://api.logo.dev/v1/logo?domain=${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API logo.dev retornou status ${response.status}`);
    }

    const data: LogoResponse = await response.json();
    
    if (data.status === 'error' || !data.logo_url) {
      console.error('Erro ao buscar logo:', data.message || 'URL do logo não encontrada');
      return null;
    }
    
    console.log('Logo obtido com sucesso:', data.logo_url);
    return data.logo_url;
  } catch (error) {
    console.error('Erro ao buscar o logo do site:', error);
    toast.error('Não foi possível obter o logo do site', {
      description: 'Usando análise sem logo'
    });
    return null;
  }
}

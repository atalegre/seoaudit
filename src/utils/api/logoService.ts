
import { toast } from 'sonner';

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
    
    const response = await fetch(`https://api.logo.dev/v1/logo?domain=${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer sk_RM22KfReRJ2LjotDAYgcxA`,
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
    
    return data.logo_url;
  } catch (error) {
    console.error('Erro ao buscar o logo do site:', error);
    toast.error('Não foi possível obter o logo do site', {
      description: 'Usando análise sem logo'
    });
    return null;
  }
}

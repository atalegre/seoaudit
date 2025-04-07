
import { WebsiteData } from '@/components/dashboard/client/WebsitesSection';
import { Client } from '@/utils/api/types';

/**
 * Normaliza dados de website, manipulando tanto WebsiteData quanto Client
 * @param website Objeto website para normalizar
 * @returns Dados normalizados com url, status e lastAnalyzed
 */
export const normalizeWebsiteData = (website: WebsiteData | Client): {
  url: string;
  status: string;
  lastAnalyzed: string | Date | null;
} => {
  // Verificar se o objeto é válido
  if (!website) {
    return {
      url: '',
      status: 'Desconhecido',
      lastAnalyzed: null
    };
  }
  
  // Determinar url baseado nos campos disponíveis
  const url = 'website' in website && website.website 
    ? website.website 
    : 'url' in website && website.url 
      ? website.url 
      : '';
  
  // Determinar status
  const status = website.status || 'Ativo';
  
  // Determinar data de última análise
  const lastAnalyzed = 'lastAnalysis' in website 
    ? website.lastAnalysis 
    : 'lastAnalyzed' in website ? website.lastAnalyzed : null;
  
  return { url, status, lastAnalyzed };
};

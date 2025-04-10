
import { useState } from 'react';
import { fetchSiteLogo } from '@/utils/api/logoService';

/**
 * Hook to handle fetching and managing site logos
 */
export function useLogoFetcher() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);

  /**
   * Fetches a logo for the given URL
   */
  const fetchLogo = async (url: string) => {
    if (!url) return;
    
    try {
      setIsFetchingLogo(true);
      const logo = await fetchSiteLogo(url);
      if (logo) {
        setLogoUrl(logo);
      }
    } catch (error) {
      console.error('Erro ao buscar logo:', error);
    } finally {
      setIsFetchingLogo(false);
    }
  };

  return {
    logoUrl,
    isFetchingLogo,
    fetchLogo
  };
}

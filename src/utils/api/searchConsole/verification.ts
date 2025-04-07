
import { toast } from 'sonner';
import { createTimedRequest, getGoogleApiHeaders } from '../pageInsights/corsHandlers';
import { SEARCH_CONSOLE_API, normalizeUrl } from './config';
import type { SearchConsoleError } from './types';

/**
 * Verifies if a site is verified in Search Console
 * @param siteUrl URL of the site to verify
 * @param authToken Google authentication token
 */
export async function checkSiteVerification(siteUrl: string, authToken: string): Promise<boolean> {
  try {
    console.log('Verificando site no Search Console:', siteUrl);
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(siteUrl);
    
    const { fetchProps, clearTimeout } = createTimedRequest(SEARCH_CONSOLE_API, 30000);
    
    const response = await fetch(SEARCH_CONSOLE_API, {
      ...fetchProps,
      headers: getGoogleApiHeaders(authToken),
    });
    
    clearTimeout();
    
    if (!response.ok) {
      const errorData = await response.json() as SearchConsoleError;
      console.error('Erro ao verificar site no Search Console:', errorData);
      return false;
    }
    
    const data = await response.json();
    // Check if the site is in the user's site list
    return data.siteEntry?.some((entry: any) => 
      entry.siteUrl === normalizedUrl || 
      entry.siteUrl === normalizedUrl + '/'
    ) || false;
  } catch (error) {
    console.error('Erro ao verificar site no Search Console:', error);
    return false;
  }
}

/**
 * Gets Google verification meta tags
 * @param siteUrl URL of the site
 * @param authToken Google authentication token
 */
export async function getGoogleVerificationMeta(siteUrl: string, authToken: string): Promise<string | null> {
  try {
    // Normalize the URL
    const normalizedUrl = normalizeUrl(siteUrl);
    
    const apiUrl = `${SEARCH_CONSOLE_API}/${encodeURIComponent(normalizedUrl)}/verificationDetails`;
    const { fetchProps, clearTimeout } = createTimedRequest(apiUrl, 30000);
    
    const response = await fetch(apiUrl, {
      ...fetchProps,
      headers: getGoogleApiHeaders(authToken),
    });
    
    clearTimeout();
    
    if (!response.ok) {
      console.error('Erro ao obter meta de verificação:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.metatag || null;
  } catch (error) {
    console.error('Erro ao obter meta de verificação:', error);
    return null;
  }
}

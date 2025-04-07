
import { extractDomainFromUrl } from '@/utils/domainUtils';

/**
 * Preloads a website logo from the Clearbit API
 * @param url The website URL to load a logo for
 * @returns The logo URL or null if domain extraction failed
 */
export function preloadLogo(url: string): string | null {
  const domain = extractDomainFromUrl(url);
  if (!domain) return null;
  
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  
  // Use Image() to preload the image
  const preloadImage = new Image();
  preloadImage.src = logoUrl;
  
  return logoUrl;
}

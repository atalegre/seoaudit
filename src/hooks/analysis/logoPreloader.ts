
import { extractDomainFromUrl } from '@/utils/domainUtils';

/**
 * Preloads a website logo from the Google's favicon service
 * @param url The website URL to load a logo for
 * @returns The logo URL or null if domain extraction failed
 */
export function preloadLogo(url: string): string | null {
  const domain = extractDomainFromUrl(url);
  if (!domain) return null;
  
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  
  // Use Image() to preload the image
  const preloadImage = new Image();
  preloadImage.src = logoUrl;
  
  return logoUrl;
}

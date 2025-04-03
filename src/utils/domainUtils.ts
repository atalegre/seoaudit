
/**
 * Extracts the domain from a URL string.
 * @param url - The URL to extract domain from
 * @returns The domain name without protocol and www prefix if possible
 */
export const extractDomainFromUrl = (url: string): string => {
  if (!url) return '';
  
  let normalizedUrl = url.toLowerCase().trim();
  
  // Add protocol if missing
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  
  try {
    const urlObj = new URL(normalizedUrl);
    return urlObj.hostname;
  } catch (error) {
    console.error('Invalid URL format:', normalizedUrl);
    // Fallback to regex matching if URL parsing fails
    const domainMatch = normalizedUrl.match(/^https?:\/\/([^\/]+)/i);
    return domainMatch ? domainMatch[1].toLowerCase() : '';
  }
};

/**
 * Normalizes a domain by removing the www prefix and cleaning it
 * @param domain - The domain to normalize
 * @returns The normalized domain
 */
export const normalizeDomain = (domain: string): string => {
  if (!domain) return '';
  return domain.toLowerCase().replace(/^www\./, '');
};

/**
 * Check if two domains are related/matching
 * @param domain1 - First domain to compare
 * @param domain2 - Second domain to compare
 * @returns True if domains are related
 */
export const areDomainsRelated = (domain1: string, domain2: string): boolean => {
  if (!domain1 || !domain2) return false;
  
  const clean1 = normalizeDomain(domain1);
  const clean2 = normalizeDomain(domain2);
  
  return clean1 === clean2 || 
         clean1.includes(clean2) || 
         clean2.includes(clean1);
};

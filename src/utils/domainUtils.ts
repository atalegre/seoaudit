/**
 * Extracts the domain from a URL.
 * @param url The URL to extract the domain from
 * @returns The extracted domain
 */
export const extractDomainFromUrl = (url: string): string => {
  try {
    if (!url) return '';
    // Remove protocol and www if present
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
  } catch (e) {
    return url;
  }
};

/**
 * Formats a domain from a URL for display.
 * @param url The URL to format
 * @returns The formatted domain
 */
export const formatDomainFromUrl = (url: string): string => {
  try {
    if (!url) return '';
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  } catch (e) {
    return url;
  }
};

/**
 * Normalizes a domain by removing www, protocols, and query parameters.
 * @param domain The domain to normalize
 * @returns The normalized domain
 */
export const normalizeDomain = (domain: string): string => {
  if (!domain) return '';
  
  try {
    // Remove protocols, www, and keep only the domain name
    return domain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0];
  } catch (e) {
    return domain.toLowerCase().trim();
  }
};

/**
 * Checks if two domains are related by looking for commonalities.
 * @param domain1 First domain to compare
 * @param domain2 Second domain to compare
 * @returns True if domains appear to be related
 */
export const areDomainsRelated = (domain1: string, domain2: string): boolean => {
  if (!domain1 || !domain2) return false;
  
  const normalized1 = normalizeDomain(domain1);
  const normalized2 = normalizeDomain(domain2);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Check if one is a subdomain of the other
  const parts1 = normalized1.split('.');
  const parts2 = normalized2.split('.');
  
  // Get main domain without TLD (e.g., "example" from "example.com")
  const mainName1 = parts1.length > 1 ? parts1[parts1.length - 2] : parts1[0];
  const mainName2 = parts2.length > 1 ? parts2[parts2.length - 2] : parts2[0];
  
  // Check if main domain names are the same or if one contains the other
  return mainName1 === mainName2 || 
         mainName1.includes(mainName2) || 
         mainName2.includes(mainName1);
};

/**
 * Compares company names to check if they're similar.
 * @param name1 First company name to compare
 * @param name2 Second company name to compare
 * @returns True if names appear to be similar
 */
export const areCompanyNamesSimilar = (name1: string, name2: string): boolean => {
  if (!name1 || !name2) return false;
  
  const normalized1 = name1.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalized2 = name2.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Remove common business terms like "LLC", "Inc", "Ltd" and compare again
  const businessTerms = [
    'ltd', 'limited', 'llc', 'inc', 'incorporated', 'co', 'company', 
    'corp', 'corporation', 'lda', 'sa', 'unipessoal'
  ];
  
  let cleaned1 = normalized1;
  let cleaned2 = normalized2;
  
  businessTerms.forEach(term => {
    cleaned1 = cleaned1.replace(new RegExp(`\\b${term}\\b`, 'gi'), '');
    cleaned2 = cleaned2.replace(new RegExp(`\\b${term}\\b`, 'gi'), '');
  });
  
  cleaned1 = cleaned1.trim();
  cleaned2 = cleaned2.trim();
  
  // Final comparison after cleaning
  return cleaned1 === cleaned2 || 
         cleaned1.includes(cleaned2) || 
         cleaned2.includes(cleaned1);
};

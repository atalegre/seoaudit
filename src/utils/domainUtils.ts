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
    return domainMatch ? domainMatch[1].toLowerCase() : normalizedUrl;
  }
};

/**
 * Normalizes a domain by removing www prefix, protocols, and paths
 * @param domain - The domain to normalize
 * @returns The normalized domain
 */
export const normalizeDomain = (domain: string): string => {
  if (!domain) return '';
  
  // Remove protocol if present
  let normalized = domain.replace(/^https?:\/\//i, '');
  
  // Remove www prefix
  normalized = normalized.replace(/^www\./i, '');
  
  // Remove any paths or query parameters
  normalized = normalized.split('/')[0];
  
  // Remove any port numbers
  normalized = normalized.split(':')[0];
  
  return normalized.toLowerCase().trim();
};

/**
 * Extracts the base domain (e.g., example.com from sub.example.com)
 * @param domain - The domain to extract base from
 * @returns The base domain
 */
export const extractBaseDomain = (domain: string): string => {
  const normalized = normalizeDomain(domain);
  if (!normalized) return '';
  
  // Split the domain by dots
  const parts = normalized.split('.');
  
  // If we have fewer than 2 parts, return the original
  if (parts.length < 2) return normalized;
  
  // For domains with common TLDs like .co.uk, .com.br, etc.
  const commonSecondLevelTLDs = ['co.uk', 'com.br', 'com.au', 'co.nz', 'co.za'];
  
  // Check if the last two parts form a common second-level TLD
  const lastTwoParts = parts.slice(-2).join('.');
  if (commonSecondLevelTLDs.includes(lastTwoParts) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  
  // Otherwise return the last two parts
  return parts.slice(-2).join('.');
};

/**
 * Check if two domains are related/matching with improved accuracy
 * @param domain1 - First domain to compare
 * @param domain2 - Second domain to compare
 * @returns True if domains are related
 */
export const areDomainsRelated = (domain1: string, domain2: string): boolean => {
  if (!domain1 || !domain2) return false;
  
  const clean1 = normalizeDomain(domain1);
  const clean2 = normalizeDomain(domain2);
  
  // Perfect match after normalization
  if (clean1 === clean2) return true;
  
  // Check if one is a subdomain of the other
  const base1 = extractBaseDomain(clean1);
  const base2 = extractBaseDomain(clean2);
  
  // If base domains match
  if (base1 === base2) return true;
  
  // Check if one domain contains the other completely
  // This helps with cases like "mycompany.pt" vs "mycompany-official.pt"
  return (clean1.includes(clean2) || clean2.includes(clean1));
};

/**
 * Compare company name similarity for directory matching
 * @param name1 - First company name
 * @param name2 - Second company name
 * @returns True if names are similar enough
 */
export const areCompanyNamesSimilar = (name1?: string, name2?: string): boolean => {
  if (!name1 || !name2) return false;
  
  const normalized1 = name1.toLowerCase().trim()
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ');   // Normalize spaces
  
  const normalized2 = name2.toLowerCase().trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
    
  // Direct match
  if (normalized1 === normalized2) return true;
  
  // One contains the other completely
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Check for word matches (significant words only)
  const words1 = normalized1.split(' ').filter(word => word.length > 3);
  const words2 = normalized2.split(' ').filter(word => word.length > 3);
  
  // Check if any significant words match
  return words1.some(word => words2.includes(word));
};

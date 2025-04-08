
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

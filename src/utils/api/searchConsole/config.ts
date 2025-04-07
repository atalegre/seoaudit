
// Search Console API endpoint
export const SEARCH_CONSOLE_API = 'https://searchconsole.googleapis.com/webmasters/v3/sites';

/**
 * Normalizes a URL for the format expected by Google APIs
 * @param siteUrl URL to normalize
 */
export function normalizeUrl(siteUrl: string): string {
  return siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
}

/**
 * Formats start and end dates for Search Console queries
 * @param startDate Optional start date (default: 28 days ago)
 * @param endDate Optional end date (default: today)
 */
export function getDateRange(
  startDate?: string,
  endDate?: string
): { startDate: string, endDate: string } {
  if (!startDate) {
    startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  
  if (!endDate) {
    endDate = new Date().toISOString().split('T')[0];
  }
  
  return { startDate, endDate };
}

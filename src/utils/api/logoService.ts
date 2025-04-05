import { extractDomainFromUrl } from '../domainUtils';
import { getApiKey } from './supabaseClient';

/**
 * Fetches the site logo URL using the Clearbit Logo API
 */
export async function fetchSiteLogo(url: string): Promise<string | null> {
  try {
    const domain = extractDomainFromUrl(url);
    if (!domain) {
      console.warn('Could not extract domain from URL:', url);
      return null;
    }
    
    // Get user email from local storage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.warn('User email not found in localStorage');
      return null;
    }
    
    // Get API key from Supabase
    const apiKey = await getApiKey(userEmail, 'default');
    if (!apiKey || !apiKey.apiKey) {
      console.warn('Clearbit API key not found for user:', userEmail);
      return null;
    }
    
    const apiUrl = `https://logo.clearbit.com/${domain}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      redirect: 'follow' // Important to follow redirects
    });
    
    if (response.ok) {
      return response.url; // Return the final URL after redirects
    } else {
      console.warn(`Failed to fetch logo for ${domain}:`, response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching site logo:', error);
    return null;
  }
}

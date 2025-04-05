import { google } from 'googleapis';
import { getApiKey } from '../supabaseClient';
import { extractDomainFromUrl } from '../../domainUtils';

const lighthouse = google.lighthouse('v2');

/**
 * Fetches PageSpeed Insights data for a given URL.
 */
export async function getPageInsightsData(url: string) {
  try {
    // Extract the domain from the URL
    const domain = extractDomainFromUrl(url);
    if (!domain) {
      throw new Error('Invalid URL provided.');
    }
    
    // Get the user's email from local storage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('User email not found in local storage.');
    }
    
    // Get the API key from Supabase
    const apiKey = await getApiKey(userEmail, 'default');
    if (!apiKey?.apiKey) {
      throw new Error('Google API key not found. Please configure it in the settings.');
    }
    
    // Call the PageSpeed Insights API
    const response = await lighthouse.pagespeedapi.runpagespeed({
      url: url,
      key: apiKey.apiKey,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    });
    
    // Check if the API returned an error
    if (response.status !== 200) {
      console.error('Error from PageSpeed Insights API:', response.statusText);
      throw new Error(`PageSpeed Insights API error: ${response.statusText}`);
    }
    
    // Return the API response data
    return response.data;
  } catch (error: any) {
    console.error('Error fetching PageSpeed Insights data:', error);
    
    // Check if the error is due to an invalid API key
    if (error.message.includes('API key not valid')) {
      throw new Error('Invalid Google API key. Please check your API key and try again.');
    }
    
    // Re-throw the error
    throw error;
  }
}


import { GTM_ID } from '../types';

/**
 * Validate if Google Tags are present
 */
export function validateTagsPresence(): void {
  if (typeof window === 'undefined') return;
  
  try {
    console.info('Checking for Google tags...');
    
    // Check if dataLayer exists
    if (window.dataLayer) {
      console.info('dataLayer is properly initialized with', window.dataLayer.length, 'events');
      console.info('dataLayer contents:', JSON.stringify(window.dataLayer.slice(0, 5)));
      
      // Push a debug event to confirm dataLayer is working
      window.dataLayer.push({ event: 'debug_event', timestamp: new Date().toISOString() });
      console.info('Pushed debug event to dataLayer');
    } else {
      console.warn('dataLayer is not initialized');
    }
    
    // Check if GTM script exists
    const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
    console.info('Found GTM script tags:', gtmScripts.length);
    
    gtmScripts.forEach(script => {
      const src = script.getAttribute('src') || '';
      if (src.includes('gtm.js')) {
        const idMatch = src.match(/[?&]id=([^&]*)/);
        if (idMatch) {
          console.info('GTM ID found in script:', idMatch[1]);
        }
      } else if (src.includes('analytics.js') || src.includes('gtag/js')) {
        const idMatch = src.match(/[?&]id=([^&]*)/);
        if (idMatch) {
          console.info('GA4 ID found in script:', idMatch[1]);
        }
      }
    });
    
    // Check if GTM is available globally
    console.info('GTM available:', !!window.google_tag_manager);
    console.info('GA4 available:', !!(window.gtag || window.ga));
    
    // Check if GTM container with the specified ID exists
    if (window.google_tag_manager && window.google_tag_manager[GTM_ID]) {
      console.info('GTM ID being used:', GTM_ID);
    } else {
      console.warn('GTM container with ID', GTM_ID, 'is not initialized');
    }
    
    // If noscript iframe exists
    const gtmIframes = document.querySelectorAll('iframe[src*="googletagmanager.com/ns.html"]');
    if (gtmIframes.length > 0) {
      console.info('GTM noscript iframe is present');
    } else {
      console.warn('GTM noscript iframe is missing');
    }
  } catch (e) {
    console.error('Error validating tags presence:', e);
  }
}

/**
 * Verify cross-domain tracking is properly set up
 */
export function verifyCrossDomainTracking(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Get GA4 script elements
    const ga4Scripts = document.querySelectorAll('script[src*="gtag/js"]');
    console.info('Found GA4 script tags:', ga4Scripts.length);
    
    // Extract measurement ID
    let measurementId = '';
    ga4Scripts.forEach(script => {
      const src = script.getAttribute('src') || '';
      const idMatch = src.match(/[?&]id=([^&]*)/);
      if (idMatch) {
        measurementId = idMatch[1];
        console.info('GA4 ID found in script:', measurementId);
      }
    });
    
    if (measurementId) {
      console.info('Verifying cross-domain configuration for', measurementId);
      
      // List of domains that should be in cross-domain config
      const domains = [
        'seoaudit.pt',
        window.location.hostname,
        window.location.hostname.replace('lovableproject.com', 'lovable.app')
      ];
      
      console.info('Cross-domain domains that should be configured:', domains);
      
      // Push test event to check if cross-domain is working
      if (window.gtag) {
        window.gtag('event', 'cross_domain_test', {
          'send_to': measurementId,
          'debug_mode': true
        });
        console.info('Cross-domain test event pushed to dataLayer');
      }
      
      // Check if current domain is in the list
      if (domains.includes(window.location.hostname)) {
        console.info('Current site is in the cross-domain list:', window.location.hostname);
      } else {
        console.warn('Current site may not be configured for cross-domain tracking');
      }
    }
    
    // Check if GTM script exists in document
    const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]');
    if (gtmScripts.length > 0) {
      console.info('GTM script found in DOM');
    } else {
      console.warn('GTM script not found in DOM');
    }
  } catch (e) {
    console.error('Error verifying cross-domain tracking:', e);
  }
}

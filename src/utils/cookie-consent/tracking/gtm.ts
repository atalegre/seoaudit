
import { GTM_ID } from '../types';

/**
 * Inject Google Tag Manager 
 */
export function injectGTM(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Check if GTM script is already in the document
    if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) {
      console.info('GTM already exists in the document');
      return;
    }
    
    // Create dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Initialize GTM with proper script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.insertBefore(script, document.head.firstChild);
    
    // Push GTM initialization event
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    
    // Create and inject GTM noscript iframe
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    
    noscript.appendChild(iframe);
    
    // If body exists, add the noscript element
    if (document.body) {
      document.body.insertBefore(noscript, document.body.firstChild);
    } else {
      // If body doesn't exist yet, wait for DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => {
        document.body.insertBefore(noscript, document.body.firstChild);
      });
    }
    
    console.info('Successfully injected GTM into the document with ID:', GTM_ID);
  } catch (e) {
    console.error('Error injecting GTM:', e);
  }
}

/**
 * Check if GTM is properly installed
 */
export function checkGTMInstallation(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if dataLayer exists
  const hasDataLayer = !!window.dataLayer;
  
  // Check if GTM script exists
  const hasGTMScript = !!document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`);
  
  // Check if GTM iframe exists
  const hasGTMIframe = !!document.querySelector(`iframe[src*="googletagmanager.com/ns.html?id=${GTM_ID}"]`);
  
  console.info('GTM installation check:', { 
    dataLayer: hasDataLayer, 
    script: hasGTMScript, 
    iframe: hasGTMIframe 
  });
  
  return hasDataLayer && hasGTMScript;
}

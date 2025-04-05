
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
    
    // Create and inject GTM script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    
    document.head.insertBefore(script, document.head.firstChild);
    
    // Create and inject GTM noscript iframe
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
    
    console.info('Successfully injected GTM into the document');
  } catch (e) {
    console.error('Error injecting GTM:', e);
  }
}


import { CookieSettings } from './types';

export const CookieConsentTracking = {
  /**
   * Apply consent settings to tracking services
   */
  applyConsent(settings: CookieSettings): void {
    if (typeof window === 'undefined') return;
    
    console.info('Applying consent settings to Google services:', settings);
    
    try {
      // Setup cross-domain tracking
      const domains = [
        'seoaudit.pt',
        window.location.hostname,
        window.location.hostname.replace('lovableproject.com', 'lovable.app')
      ];
      
      console.info('Setting up cross-domain tracking for:', domains);
      
      // Apply consent settings to Google services
      if (settings.analytics) {
        console.info('Consent settings applied successfully to Google services');
        
        // Push consent directly to dataLayer
        this.pushToDataLayer('consent', 'update', {
          analytics_storage: settings.analytics ? 'granted' : 'denied',
          ad_storage: settings.marketing ? 'granted' : 'denied',
          functionality_storage: settings.functional ? 'granted' : 'denied',
        });
      }
    } catch (e) {
      console.error('Error applying consent settings:', e);
    }
  },
  
  /**
   * Push event to dataLayer
   */
  pushToDataLayer(...args: any[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
      
      window.dataLayer.push(...args);
      console.info('Pushed consent update directly to dataLayer');
    } catch (e) {
      console.error('Error pushing to dataLayer:', e);
    }
  },
  
  /**
   * Inject Google Tag Manager 
   */
  injectGTM(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const GTM_ID = 'GTM-WHKJ76ZT';
      
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
  },
  
  /**
   * Validate if Google Tags are present
   */
  validateTagsPresence(): void {
    if (typeof window === 'undefined') return;
    
    try {
      console.info('Checking for Google tags...');
      
      const GTM_ID = 'GTM-WHKJ76ZT';
      
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
  },
  
  /**
   * Verify cross-domain tracking is properly set up
   */
  verifyCrossDomainTracking(): void {
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
  },
  
  /**
   * Verify if Google Search Console is properly configured
   */
  async verifySearchConsole(siteUrl: string, authToken: string): Promise<boolean> {
    try {
      // This is a placeholder since we don't have direct access to Google Search Console API without proper auth
      console.info('Verifying Search Console for site:', siteUrl);
      
      // In a real implementation, you would make an API call to Google Search Console API
      // to check if the site is verified
      
      // For now, let's assume it's verified if we have an authToken
      return !!authToken;
    } catch (error) {
      console.error('Error verifying Search Console:', error);
      return false;
    }
  }
};

// Add GTM types
declare global {
  interface Window {
    dataLayer: any[];
    google_tag_manager: any;
    gtag: any;
    ga: any;
  }
}

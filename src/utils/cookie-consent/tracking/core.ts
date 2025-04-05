
import { CookieSettings } from '../types';

/**
 * Push event to dataLayer
 */
export function pushToDataLayer(...args: any[]): void {
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
}

/**
 * Apply consent settings to tracking services
 */
export function applyConsent(settings: CookieSettings): void {
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
      pushToDataLayer('consent', 'update', {
        analytics_storage: settings.analytics ? 'granted' : 'denied',
        ad_storage: settings.marketing ? 'granted' : 'denied',
        functionality_storage: settings.functional ? 'granted' : 'denied',
      });
    }
  } catch (e) {
    console.error('Error applying consent settings:', e);
  }
}

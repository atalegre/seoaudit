
import { CookieSettings, CROSS_DOMAIN_SITES, GTM_ID } from './types';

/**
 * Tracking services utilities for cookie consent
 */
export const CookieConsentTracking = {
  /**
   * Apply consent settings to tracking services (Google Analytics, GTM)
   */
  applyConsent(settings: CookieSettings): void {
    // Ensure window and dataLayer are defined
    if (typeof window === 'undefined') return;
    
    // Initialize dataLayer if not already defined
    window.dataLayer = window.dataLayer || [];
    
    try {
      console.log('Checking for Google tags...');
      console.log('GTM available:', typeof window.dataLayer !== 'undefined');
      console.log('GA4 available:', typeof window.gtag === 'function');
      
      // Print the GTM tag ID from the DOM if available
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager"]');
      if (gtmScripts.length > 0) {
        console.log('Found GTM script tags:', gtmScripts.length);
        gtmScripts.forEach(script => {
          const src = script.getAttribute('src') || '';
          const idMatch = src.match(/[?&]id=([^&]+)/);
          if (idMatch) {
            console.log('GTM ID found in script:', idMatch[1]);
          }
        });
      } else {
        console.warn('No GTM script tags found in DOM');
      }
      
      // First update Google's consent mode
      if (typeof window.gtag === 'function') {
        console.log('Applying consent settings to Google services:', settings);
        
        // Default format for Google Consent Mode v2
        window.gtag('consent', 'update', {
          'analytics_storage': settings.analytics ? 'granted' : 'denied',
          'ad_storage': settings.marketing ? 'granted' : 'denied',
          'functionality_storage': settings.functional ? 'granted' : 'denied',
          'personalization_storage': settings.functional ? 'granted' : 'denied',
          'security_storage': 'granted', // Always needed for security purposes
        });
        
        // Configure cross-domain tracking if analytics is enabled
        if (settings.analytics) {
          console.log('Setting up cross-domain tracking for:', CROSS_DOMAIN_SITES);
          window.gtag('config', 'G-33EYX0JZM1', {
            'linker': {
              'domains': CROSS_DOMAIN_SITES,
              'accept_incoming': true,
              'decorate_forms': true
            }
          });
          
          // Also push cross-domain config to dataLayer
          window.dataLayer.push({
            'event': 'configure_cross_domain',
            'gtm_id': GTM_ID,
            'cross_domain_config': {
              'domains': CROSS_DOMAIN_SITES,
              'enabled': true
            }
          });
        }
        
        // Also push the consent update directly to dataLayer for GTM
        window.dataLayer.push({
          'event': 'cookie_consent_update',
          'gtm_id': GTM_ID,
          'cookie_consent': {
            'analytics': settings.analytics,
            'functional': settings.functional,
            'marketing': settings.marketing
          }
        });
        
        console.log('Consent settings applied successfully to Google services');
      } else {
        console.warn('Google tag (gtag) not available, consent settings not applied through gtag');
      }
      
      // Always push to dataLayer as a fallback even if gtag is not defined
      window.dataLayer.push({
        'event': 'cookie_consent_update',
        'gtm_id': GTM_ID,
        'cookie_consent': {
          'analytics': settings.analytics,
          'functional': settings.functional,
          'marketing': settings.marketing
        }
      });
      console.log('Pushed consent update directly to dataLayer');
    } catch (error) {
      console.error('Error applying consent settings:', error);
    }
  },
  
  /**
   * Validate if Google Tags are present and working
   */
  validateTagsPresence(): void {
    try {
      // Check for dataLayer
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        console.log('dataLayer is properly initialized with', window.dataLayer.length, 'events');
      } else {
        console.warn('dataLayer is not properly initialized');
      }
      
      // Manually test GTM
      window.dataLayer.push({
        'event': 'debug_event',
        'gtm_id': GTM_ID,
        'debug_time': new Date().toISOString()
      });
      console.log('Pushed debug event to dataLayer');
      
      // Check for GA4 configuration
      if (typeof window.gtag === 'function') {
        // Get the GA4 measurement ID that's in use
        const gaScripts = document.querySelectorAll('script[src*="gtag/js"]');
        if (gaScripts.length > 0) {
          console.log('Found GA4 script tags:', gaScripts.length);
          gaScripts.forEach(script => {
            const src = script.getAttribute('src') || '';
            const idMatch = src.match(/[?&]id=([^&]+)/);
            if (idMatch) {
              console.log('GA4 ID found in script:', idMatch[1]);
              
              // Also check cross-domain configuration
              console.log('Verifying cross-domain configuration for', idMatch[1]);
              this.verifyCrossDomainTracking();
            }
          });
        } else {
          console.warn('No GA4 script tags found in DOM');
        }
      }
    } catch (error) {
      console.error('Error validating tags presence:', error);
    }
  },
  
  /**
   * Verify cross-domain tracking is properly set up
   */
  verifyCrossDomainTracking(): void {
    try {
      console.log('Cross-domain domains that should be configured:', CROSS_DOMAIN_SITES);
      
      // Push a test event to verify cross-domain tracking
      window.dataLayer.push({
        'event': 'test_cross_domain',
        'gtm_id': GTM_ID,
        'cross_domain_test': {
          'timestamp': new Date().toISOString(),
          'domains': CROSS_DOMAIN_SITES
        }
      });
      
      console.log('Cross-domain test event pushed to dataLayer');
      
      // If we're on a cross-domain site, log that
      const currentDomain = window.location.hostname;
      if (CROSS_DOMAIN_SITES.includes(currentDomain)) {
        console.log('Current site is in the cross-domain list:', currentDomain);
      } else {
        console.log('Current site is not in the cross-domain list:', currentDomain);
      }
    } catch (error) {
      console.error('Error verifying cross-domain tracking:', error);
    }
  }
};

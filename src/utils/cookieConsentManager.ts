
import { supabase } from '@/integrations/supabase/client';

interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'cookieConsent';

/**
 * Cookie consent utility to manage user consent preferences
 */
export const CookieConsentManager = {
  /**
   * Get stored cookie consent settings
   */
  getConsent(): CookieSettings | null {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error reading cookie consent:', e);
      return null;
    }
  },
  
  /**
   * Save cookie consent settings
   * If user is authenticated, also saves to Supabase database
   */
  async saveConsent(settings: CookieSettings): Promise<void> {
    try {
      // Always save to localStorage for immediate access
      localStorage.setItem(CONSENT_KEY, JSON.stringify(settings));
      
      // Apply the consent settings to tracking services
      this.applyConsent(settings);
      
      // If user is authenticated, save to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;
        
        // Store in the api_keys table under a special key_type
        const { error } = await supabase
          .from('api_keys')
          .upsert({
            key_type: 'cookie_consent',
            key_value: JSON.stringify(settings),
            user_id: userId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key_type, user_id' });
          
        if (error) {
          console.error('Error saving cookie consent to database:', error);
        } else {
          console.log('Cookie consent preferences saved to database');
        }
      }
    } catch (e) {
      console.error('Error saving cookie consent:', e);
    }
  },
  
  /**
   * Reset cookie consent (removes stored preferences)
   */
  async resetConsent(): Promise<void> {
    localStorage.removeItem(CONSENT_KEY);
    
    // If user is authenticated, also remove from database
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;
        
        const { error } = await supabase
          .from('api_keys')
          .delete()
          .eq('key_type', 'cookie_consent')
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error deleting cookie consent from database:', error);
        } else {
          console.log('Cookie consent preferences removed from database');
        }
      }
    } catch (e) {
      console.error('Error resetting cookie consent in database:', e);
    }
  },
  
  /**
   * Load consent settings from database if user is authenticated
   * Returns the settings if found, null otherwise
   */
  async loadConsentFromDatabase(): Promise<CookieSettings | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return null;
      }
      
      const userId = session.user.id;
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_type', 'cookie_consent')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      const settings = JSON.parse(data.key_value);
      // Update localStorage with the settings from database
      localStorage.setItem(CONSENT_KEY, data.key_value);
      
      return settings;
    } catch (e) {
      console.error('Error loading cookie consent from database:', e);
      return null;
    }
  },
  
  /**
   * Apply consent settings to tracking services
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
        
        // Also push the consent update directly to dataLayer for GTM
        window.dataLayer.push({
          'event': 'cookie_consent_update',
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
        'cookie_consent': {
          'analytics': settings.analytics,
          'functional': settings.functional,
          'marketing': settings.marketing
        }
      });
      console.log('Pushed consent update directly to dataLayer');
      
      // Additional debug info for GTM
      this.validateTagsPresence();
      
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
            }
          });
        } else {
          console.warn('No GA4 script tags found in DOM');
        }
      }
    } catch (error) {
      console.error('Error validating tags presence:', error);
    }
  }
};

// Create a simpler export for direct use
export default CookieConsentManager;


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
    // Update Google's consent mode if gtag is available
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': settings.analytics ? 'granted' : 'denied',
        'ad_storage': settings.marketing ? 'granted' : 'denied',
        'functionality_storage': settings.functional ? 'granted' : 'denied',
      });
    }
  }
};

export default CookieConsentManager;

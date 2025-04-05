
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
   */
  saveConsent(settings: CookieSettings): void {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(settings));
      this.applyConsent(settings);
    } catch (e) {
      console.error('Error saving cookie consent:', e);
    }
  },
  
  /**
   * Reset cookie consent (removes stored preferences)
   */
  resetConsent(): void {
    localStorage.removeItem(CONSENT_KEY);
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

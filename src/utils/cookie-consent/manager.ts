
import { CookieSettings } from './types';
import { CookieConsentStorage } from './storage';
import { CookieConsentTracking } from './tracking';

/**
 * Main cookie consent manager that coordinates storage and tracking
 */
export const CookieConsentManager = {
  /**
   * Get stored cookie consent settings
   */
  getConsent(): CookieSettings | null {
    return CookieConsentStorage.getFromLocalStorage();
  },
  
  /**
   * Save cookie consent settings
   * If user is authenticated, also saves to Supabase database
   */
  async saveConsent(settings: CookieSettings): Promise<void> {
    try {
      // Always save to localStorage for immediate access
      CookieConsentStorage.saveToLocalStorage(settings);
      
      // Apply the consent settings to tracking services
      this.applyConsent(settings);
      
      // If user is authenticated, save to database
      await CookieConsentStorage.saveToDatabase(settings);
    } catch (e) {
      console.error('Error saving cookie consent:', e);
    }
  },
  
  /**
   * Reset cookie consent (removes stored preferences)
   */
  async resetConsent(): Promise<void> {
    // Remove from localStorage
    CookieConsentStorage.removeFromLocalStorage();
    
    // If user is authenticated, also remove from database
    await CookieConsentStorage.removeFromDatabase();
  },
  
  /**
   * Load consent settings from database if user is authenticated
   * Returns the settings if found, null otherwise
   */
  async loadConsentFromDatabase(): Promise<CookieSettings | null> {
    try {
      const settings = await CookieConsentStorage.loadFromDatabase();
      
      if (settings) {
        // Update localStorage with the settings from database
        CookieConsentStorage.saveToLocalStorage(settings);
        return settings;
      }
      
      return null;
    } catch (e) {
      console.error('Error loading cookie consent from database:', e);
      return null;
    }
  },
  
  /**
   * Apply consent settings to tracking services
   */
  applyConsent(settings: CookieSettings): void {
    CookieConsentTracking.applyConsent(settings);
  },
  
  /**
   * Validate if Google Tags are present and working
   */
  validateTagsPresence(): void {
    CookieConsentTracking.validateTagsPresence();
  },
  
  /**
   * Verify cross-domain tracking is properly set up
   */
  verifyCrossDomainTracking(): void {
    CookieConsentTracking.verifyCrossDomainTracking();
  },
  
  /**
   * Manually inject Google Tag Manager 
   */
  injectGTM(): void {
    CookieConsentTracking.injectGTM();
  }
};

// Create a simpler export for direct use
export default CookieConsentManager;

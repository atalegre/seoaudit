
import { CookieConsentStorage, getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from './storage';
import { CookieSettings } from './types';
import { CookieConsentTracking } from './tracking';

/**
 * Main cookie consent manager that coordinates storage and tracking
 */
export const CookieConsentManager = {
  /**
   * Get stored cookie consent settings
   */
  getConsent(): CookieSettings | null {
    return getFromLocalStorage();
  },
  
  /**
   * Save cookie consent settings
   * If user is authenticated, also saves to Supabase database
   */
  async saveConsent(settings: CookieSettings): Promise<void> {
    try {
      // Always save to localStorage for immediate access
      saveToLocalStorage(settings);
      
      // Apply the consent settings to tracking services
      this.applyConsent(settings);
      
      // If user is authenticated, save to database
      // This is a stub - in a real implementation we would save to DB here
    } catch (e) {
      console.error('Error saving cookie consent:', e);
    }
  },
  
  /**
   * Reset cookie consent (removes stored preferences)
   */
  async resetConsent(): Promise<void> {
    // Remove from localStorage
    removeFromLocalStorage();
    
    // If user is authenticated, also remove from database
    // This is a stub - in a real implementation we would remove from DB here
  },
  
  /**
   * Load consent settings from database if user is authenticated
   * Returns the settings if found, null otherwise
   */
  async loadConsentFromDatabase(): Promise<CookieSettings | null> {
    try {
      // This is a stub - in a real implementation we would load from DB here
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
  },
  
  /**
   * Verify if Google Search Console is properly configured
   */
  async verifySearchConsole(siteUrl: string, authToken: string): Promise<boolean> {
    try {
      console.log('Verificando Search Console para:', siteUrl);
      
      return await CookieConsentTracking.verifySearchConsole(siteUrl, authToken);
    } catch (error) {
      console.error('Erro ao verificar Search Console:', error);
      return false;
    }
  }
};

// Create a simpler export for direct use
export default CookieConsentManager;

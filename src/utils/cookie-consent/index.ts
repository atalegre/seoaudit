
// Export types
export type { CookieSettings } from './types';

// Export manager
export { default } from './manager';

// Export storage
export { 
  saveToLocalStorage as storeCookieConsent, 
  getFromLocalStorage as getCookieConsent, 
  removeFromLocalStorage as revokeCookieConsent,
  storeApiKeyConsent,
  getApiKeyConsent,
  revokeApiKeyConsent,
  CookieConsentStorage
} from './storage';

// Export tracking class
export class CookieConsentTracking {
  static applyConsent(settings: any): void {
    console.log('Applying consent settings:', settings);
  }
  
  static validateTagsPresence(): void {
    console.log('Validating presence of Google Tags');
  }
  
  static verifyCrossDomainTracking(): void {
    console.log('Verifying cross-domain tracking');
  }
  
  static injectGTM(): void {
    console.log('Injecting Google Tag Manager');
  }
  
  static async verifySearchConsole(siteUrl: string, authToken: string): Promise<boolean> {
    console.log('Verifying Search Console for:', siteUrl);
    return false;
  }
}

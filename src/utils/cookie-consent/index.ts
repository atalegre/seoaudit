
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

// Export tracking
export { CookieConsentTracking } from './tracking';

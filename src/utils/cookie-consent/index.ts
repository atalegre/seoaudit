
// Export types
export type { CookieSettings } from './types';

// Export manager
export { default } from './manager';

// Export storage
export { 
  storeCookieConsent, 
  getCookieConsent, 
  revokeCookieConsent,
  storeApiKeyConsent,
  getApiKeyConsent,
  revokeApiKeyConsent,
  CookieConsentStorage
} from './storage';

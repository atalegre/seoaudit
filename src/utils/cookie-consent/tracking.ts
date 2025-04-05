
import { CookieSettings } from './types';
import { applyConsent, pushToDataLayer } from './tracking/core';
import { injectGTM } from './tracking/gtm';
import { validateTagsPresence, verifyCrossDomainTracking } from './tracking/validation';
import { verifySearchConsole } from './tracking/search-console';

/**
 * Main CookieConsentTracking object that coordinates tracking functionality
 */
export const CookieConsentTracking = {
  applyConsent,
  pushToDataLayer,
  injectGTM,
  validateTagsPresence,
  verifyCrossDomainTracking,
  verifySearchConsole
};

// Re-export the type declaration for gtag
export * from './tracking/types';


/**
 * Cookie settings configuration interface
 */
export interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * List of domains for cross-domain tracking
 */
export const CROSS_DOMAIN_SITES = [
  'seoaudit.pt',
  'suite.seoaudit.pt',
  'd6620331-1d39-4571-9d7c-1ad62798af11.lovableproject.com',
  'id-preview-5c8dd228--d6620331-1d39-4571-9d7c-1ad62798af11.lovable.app'
];

// Local storage key for cookie consent
export const CONSENT_KEY = 'cookieConsent';

// Google Tag Manager ID
export const GTM_ID = 'GTM-WHKJ76ZT';

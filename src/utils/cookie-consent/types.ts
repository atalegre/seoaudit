
// Cookie consent settings type
export interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Google Tag Manager ID
export const GTM_ID = 'GTM-TKTMRN43';

// API Key types
export interface ApiKeySettings {
  google?: string;
  googleSearchConsole?: string;
  googleAnalytics?: string;
}

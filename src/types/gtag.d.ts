
// Type definitions for Google Analytics gtag.js and Google Tag Manager
declare interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

// Consent mode definition types
interface ConsentOptions {
  'ad_storage'?: 'granted' | 'denied';
  'analytics_storage'?: 'granted' | 'denied';
  'functionality_storage'?: 'granted' | 'denied';
  'personalization_storage'?: 'granted' | 'denied';
  'security_storage'?: 'granted';
  'wait_for_update'?: number;
}

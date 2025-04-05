
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

// GTM event types
interface GTMEvent {
  event: string;
  [key: string]: any;
}

// GA4 measurement types
interface GA4MeasurementOptions {
  send_page_view?: boolean;
  cookie_domain?: string;
  cookie_flags?: string;
  cookie_update?: boolean;
  cookie_expires?: number;
  linker?: {
    domains: string[];
    accept_incoming?: boolean;
    urls?: string[];
    decorate_forms?: boolean;
  };
}

// Cross-domain configuration
interface CrossDomainConfig {
  domains: string[];
  enabled?: boolean;
}

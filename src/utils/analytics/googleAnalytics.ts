
import { GTM_ID } from '../cookie-consent/types';

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-33EYX0JZM1';

// Your Google Analytics API Key
export const GA_API_KEY = 'AIzaSyAVLw_atl7qltYwj79UtWokrkXJ8nbRrg8';

// Initialize Google Analytics
export function initGA() {
  if (typeof window === 'undefined') return;
  
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true,
      api_key: GA_API_KEY
    });
  }
}

// Track page views
export function pageview(url: string) {
  if (!window.gtag) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// Track events
export function event({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) {
  if (!window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

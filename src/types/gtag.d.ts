
// Type definitions for Google Analytics gtag.js
declare interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

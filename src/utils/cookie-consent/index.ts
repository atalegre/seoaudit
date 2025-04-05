
// Re-export types
export * from './types';

// Re-export the main manager
export { CookieConsentManager } from './manager';
export { default } from './manager';

// Export other modules for direct access if needed
export { CookieConsentStorage } from './storage';
export { CookieConsentTracking } from './tracking';

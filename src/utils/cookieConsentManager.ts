
// This file is kept for backward compatibility
// It re-exports the refactored cookie consent manager from the new module structure

import CookieConsentManager from './cookie-consent';
export { CookieSettings } from './cookie-consent';

// Export the default manager for backward compatibility
export default CookieConsentManager;

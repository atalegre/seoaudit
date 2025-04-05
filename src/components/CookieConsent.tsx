
import React from 'react';
import { useCookieConsent } from './cookie-consent/useCookieConsent';
import CookieConsentBanner from './cookie-consent/CookieConsentBanner';

const CookieConsent: React.FC = () => {
  const {
    showBanner,
    setShowBanner,
    showPreferences,
    cookieSettings,
    handleAcceptAll,
    handleRejectAll,
    handleSavePreferences,
    handleTogglePreferences,
    handleChange
  } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <CookieConsentBanner
      showPreferences={showPreferences}
      cookieSettings={cookieSettings}
      onClose={() => setShowBanner(false)}
      onAcceptAll={handleAcceptAll}
      onRejectAll={handleRejectAll}
      onSavePreferences={handleSavePreferences}
      onTogglePreferences={handleTogglePreferences}
      onChangeSettings={handleChange}
    />
  );
};

export default CookieConsent;

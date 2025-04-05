import { useState, useEffect } from 'react';
import CookieConsentManager from '@/utils/cookie-consent';
import { CookieSettings } from '@/utils/cookie-consent';

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    functional: true,
    analytics: true,
    marketing: false,
  });

  // Check if consent was already given
  useEffect(() => {
    const checkConsent = async () => {
      // First try to load from database (if user is authenticated)
      const dbConsent = await CookieConsentManager.loadConsentFromDatabase();
      
      if (dbConsent) {
        console.log('Loaded consent settings from database:', dbConsent);
        setCookieSettings(dbConsent);
        CookieConsentManager.applyConsent(dbConsent);
      } else {
        // Fallback to localStorage
        const storedConsent = CookieConsentManager.getConsent();
        if (!storedConsent) {
          console.log('No consent settings found, showing banner');
          setShowBanner(true);
        } else {
          console.log('Loaded consent settings from localStorage:', storedConsent);
          setCookieSettings(storedConsent);
          CookieConsentManager.applyConsent(storedConsent);
        }
      }
    };
    
    checkConsent();
    
    // Run the validation immediately to check for tag presence
    CookieConsentManager.validateTagsPresence();
    
    // Run again after a short delay to ensure everything is loaded
    setTimeout(() => {
      CookieConsentManager.validateTagsPresence();
      CookieConsentManager.verifyCrossDomainTracking();
    }, 1000);
    
    // Also run the validation after the window load event
    window.addEventListener('load', () => {
      setTimeout(() => {
        CookieConsentManager.validateTagsPresence();
      }, 500);
    });
  }, []);

  // Handle accepting all cookies
  const handleAcceptAll = async () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    console.log('Accepting all cookies:', allAccepted);
    setCookieSettings(allAccepted);
    await CookieConsentManager.saveConsent(allAccepted);
    setShowBanner(false);
    
    // Re-validate tags after consent is given
    setTimeout(() => {
      CookieConsentManager.validateTagsPresence();
    }, 500);
  };

  // Handle rejecting all non-essential cookies
  const handleRejectAll = async () => {
    const allRejected = {
      necessary: true, // Always required
      functional: false,
      analytics: false,
      marketing: false,
    };
    
    console.log('Rejecting non-essential cookies:', allRejected);
    setCookieSettings(allRejected);
    await CookieConsentManager.saveConsent(allRejected);
    setShowBanner(false);
  };

  // Handle saving custom preferences
  const handleSavePreferences = async () => {
    console.log('Saving custom cookie preferences:', cookieSettings);
    await CookieConsentManager.saveConsent(cookieSettings);
    setShowBanner(false);
    setShowPreferences(false);
  };

  // Toggle preferences view
  const handleTogglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  // Handle changing individual cookie settings
  const handleChange = (category: keyof CookieSettings) => {
    if (category === 'necessary') return; // Cannot change necessary cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Add debug functions to window
  useEffect(() => {
    (window as any).resetCookieConsent = async () => {
      console.log('Resetting cookie consent');
      await CookieConsentManager.resetConsent();
      setShowBanner(true);
    };
    
    // Also expose a function to debug the current consent state
    (window as any).debugCookieConsent = () => {
      const consent = CookieConsentManager.getConsent();
      console.log('Current cookie consent state:', consent);
      
      // Also trigger a tag validation
      CookieConsentManager.validateTagsPresence();
      CookieConsentManager.verifyCrossDomainTracking();
      
      return consent;
    };
    
    // Add a function to force show the banner for testing
    (window as any).showCookieConsent = () => {
      setShowBanner(true);
    };
    
    // Add a function to manually inject GTM
    (window as any).injectGTM = () => {
      console.log('Manually injecting GTM');
      CookieConsentManager.injectGTM();
    };
  }, []);

  return {
    showBanner,
    setShowBanner,
    showPreferences,
    cookieSettings,
    handleAcceptAll,
    handleRejectAll,
    handleSavePreferences,
    handleTogglePreferences,
    handleChange
  };
}


import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import CookieConsentManager from '@/utils/cookieConsentManager';

interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
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
    
    // Run the validation as soon as component mounts
    setTimeout(() => {
      CookieConsentManager.validateTagsPresence();
      CookieConsentManager.verifyCrossDomainTracking();
    }, 1000);
  }, []);

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
  };

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

  const handleSavePreferences = async () => {
    console.log('Saving custom cookie preferences:', cookieSettings);
    await CookieConsentManager.saveConsent(cookieSettings);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleTogglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  const handleChange = (category: keyof CookieSettings) => {
    if (category === 'necessary') return; // Cannot change necessary cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Make resetConsent available globally for testing purposes
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
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg border-t border-gray-200 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">Política de Cookies</h3>
          <button onClick={() => setShowBanner(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm mb-4">
          Utilizamos cookies para melhorar a sua experiência, fornecer funcionalidades de redes sociais e analisar o nosso tráfego. 
          Pode escolher as suas preferências de cookies. Alguns cookies são necessários para o funcionamento do site e para rastrear
          visitas entre os nossos domínios (seoaudit.pt e outros domínios relacionados).
        </p>

        {showPreferences && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Preferências de Cookies</h4>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="necessary" 
                  checked={cookieSettings.necessary} 
                  disabled
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="necessary" className="text-sm">
                  <span className="font-medium">Cookies Necessários</span> - Essenciais para o funcionamento do site
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="functional" 
                  checked={cookieSettings.functional} 
                  onChange={() => handleChange('functional')}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="functional" className="text-sm">
                  <span className="font-medium">Cookies Funcionais</span> - Permitem funcionalidades avançadas
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="analytics" 
                  checked={cookieSettings.analytics} 
                  onChange={() => handleChange('analytics')}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="analytics" className="text-sm">
                  <span className="font-medium">Cookies Analíticos</span> - Ajudam-nos a entender como usa o site
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="marketing" 
                  checked={cookieSettings.marketing} 
                  onChange={() => handleChange('marketing')}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="marketing" className="text-sm">
                  <span className="font-medium">Cookies de Marketing</span> - Permitem anúncios personalizados
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleRejectAll}>
            Rejeitar Todos
          </Button>
          <Button variant="outline" size="sm" onClick={handleTogglePreferences}>
            Preferências
          </Button>
          {showPreferences && (
            <Button variant="outline" size="sm" onClick={handleSavePreferences}>
              Guardar Preferências
            </Button>
          )}
          <Button variant="default" size="sm" onClick={handleAcceptAll}>
            Aceitar Todos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

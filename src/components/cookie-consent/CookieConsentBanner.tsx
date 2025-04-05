
import React from 'react';
import { X } from 'lucide-react';
import CookiePreferences from './CookiePreferences';
import CookieActions from './CookieActions';
import { CookieSettings } from './types';

interface CookieConsentBannerProps {
  showPreferences: boolean;
  cookieSettings: CookieSettings;
  onClose: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: () => void;
  onTogglePreferences: () => void;
  onChangeSettings: (category: keyof CookieSettings) => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  showPreferences,
  cookieSettings,
  onClose,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  onTogglePreferences,
  onChangeSettings
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg border-t border-gray-200 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">Política de Cookies</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm mb-4">
          Utilizamos cookies para melhorar a sua experiência, fornecer funcionalidades de redes sociais e analisar o nosso tráfego. 
          Pode escolher as suas preferências de cookies. Alguns cookies são necessários para o funcionamento do site e para rastrear
          visitas entre os nossos domínios (seoaudit.pt e outros domínios relacionados).
        </p>

        {showPreferences && (
          <CookiePreferences 
            cookieSettings={cookieSettings}
            handleChange={onChangeSettings}
          />
        )}

        <CookieActions 
          showPreferences={showPreferences}
          handleRejectAll={onRejectAll}
          handleTogglePreferences={onTogglePreferences}
          handleSavePreferences={onSavePreferences}
          handleAcceptAll={onAcceptAll}
        />
      </div>
    </div>
  );
};

export default CookieConsentBanner;

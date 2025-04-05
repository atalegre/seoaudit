
import React from 'react';
import { CookieSettings } from './types';

interface CookiePreferencesProps {
  cookieSettings: CookieSettings;
  handleChange: (category: keyof CookieSettings) => void;
}

const CookiePreferences: React.FC<CookiePreferencesProps> = ({ 
  cookieSettings, 
  handleChange 
}) => {
  return (
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
  );
};

export default CookiePreferences;

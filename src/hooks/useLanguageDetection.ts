
import { useState, useEffect } from 'react';
import { Language } from '../constants/languageConstants';

export const useLanguageDetection = (): Language => {
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('en');
  
  useEffect(() => {
    // Try to detect user's language preference from browser or localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    
    if (storedLanguage && (storedLanguage === 'pt' || storedLanguage === 'en')) {
      setDetectedLanguage(storedLanguage);
    } else {
      // Check user's language preferences
      detectUserLanguage().then(lang => {
        setDetectedLanguage(lang);
        localStorage.setItem('language', lang);
      });
    }
  }, []);
  
  return detectedLanguage;
};

// Function to detect user language based on timezone or navigator language
const detectUserLanguage = async (): Promise<Language> => {
  try {
    // First try to use the browser's language
    const browserLang = navigator.language.toLowerCase();
    
    // Check if from a Portuguese-speaking region
    if (browserLang.startsWith('pt') || 
        (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Lisbon')) {
      return 'pt';
    }
    
    // Default to English for non-Portuguese visitors
    return 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English on error
  }
};

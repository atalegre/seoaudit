
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, LanguageContextType } from '../constants/languageConstants';
import { translations } from '../translations';
import { useLanguageDetection } from '../hooks/useLanguageDetection';

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key: string) => key,
  initializeLanguage: () => {},
});

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const initialLanguage = useLanguageDetection();
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  const initializeLanguage = () => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    } else {
      setLanguageState(initialLanguage);
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, initializeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

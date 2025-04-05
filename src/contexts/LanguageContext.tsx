
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'pt' | 'en';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    'home': 'Home',
    'how-it-works': 'Como Funciona',
    'faq': 'FAQ',
    'blog': 'Blog',
    'contact': 'Contacto',
    'resources': 'Recursos',
    'glossary': 'Glossário',
    'guides': 'Guias',
    'checklist': 'SEO AIO Checklist',
    
    // Auth
    'sign-in': 'Entrar',
    'sign-up': 'Registar',
    'sign-out': 'Sair',
    'dashboard': 'Dashboard',
    
    // Client Page
    'clients': 'Clientes',
    'manage-clients': 'Gerencie seus clientes e acesse seus relatórios',
    'search-clients': 'Pesquisar clientes...',
    'add-client': 'Adicionar Cliente',
    'add-client-soon': 'A adição de clientes será implementada em breve.',
    'feature-in-dev': 'Funcionalidade em desenvolvimento',
    
    // Common
    'last-update': 'Última atualização',
    'never': 'Nunca',
    'active': 'Ativo',
    'critical': 'Crítico',
    'improved': 'Melhorou',
    'healthy': 'Saudável',
  },
  en: {
    // Navigation
    'home': 'Home',
    'how-it-works': 'How It Works',
    'faq': 'FAQ',
    'blog': 'Blog',
    'contact': 'Contact',
    'resources': 'Resources',
    'glossary': 'Glossary',
    'guides': 'Guides',
    'checklist': 'SEO AIO Checklist',
    
    // Auth
    'sign-in': 'Sign In',
    'sign-up': 'Sign Up',
    'sign-out': 'Sign Out',
    'dashboard': 'Dashboard',
    
    // Client Page
    'clients': 'Clients',
    'manage-clients': 'Manage your clients and access their reports',
    'search-clients': 'Search clients...',
    'add-client': 'Add Client',
    'add-client-soon': 'Client addition will be implemented soon.',
    'feature-in-dev': 'Feature in development',
    
    // Common
    'last-update': 'Last update',
    'never': 'Never',
    'active': 'Active',
    'critical': 'Critical',
    'improved': 'Improved',
    'healthy': 'Healthy',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');
  
  useEffect(() => {
    // Try to detect user's language preference from browser or localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    
    if (storedLanguage && (storedLanguage === 'pt' || storedLanguage === 'en')) {
      setLanguageState(storedLanguage);
    } else {
      // Check if user is from Portugal using time zone as an approximation
      // This is a simplified approach - a more accurate method would use geolocation APIs
      detectUserLanguage().then(detectedLanguage => {
        setLanguageState(detectedLanguage);
        localStorage.setItem('language', detectedLanguage);
      });
    }
  }, []);
  
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
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

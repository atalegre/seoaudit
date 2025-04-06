
// Define available languages
export type Language = 'pt' | 'en';

// Define the context type
export type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

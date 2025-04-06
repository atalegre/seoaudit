
import { Language } from '../constants/languageConstants';
import { ptTranslations } from './pt';
import { enTranslations } from './en';

// Translation dictionaries
export const translations: Record<Language, Record<string, string>> = {
  pt: ptTranslations,
  en: enTranslations,
};

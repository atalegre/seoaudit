
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="px-2 h-8"
    >
      <span className="font-semibold">{language === 'pt' ? 'EN' : 'PT'}</span>
    </Button>
  );
};

export default LanguageSwitcher;

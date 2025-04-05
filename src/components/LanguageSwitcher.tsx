
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="px-3 py-2 h-9 flex items-center gap-1.5 border-primary/30 hover:bg-primary/10 transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === 'pt' ? 'EN' : 'PT'}</span>
    </Button>
  );
};

export default LanguageSwitcher;

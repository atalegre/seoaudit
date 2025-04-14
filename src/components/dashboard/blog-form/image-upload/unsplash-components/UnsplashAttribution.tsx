
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnsplashAttributionProps {
  showAttribution: boolean;
}

const UnsplashAttribution: React.FC<UnsplashAttributionProps> = ({ showAttribution }) => {
  const { language } = useLanguage();
  
  if (!showAttribution) return null;
  
  return (
    <p className="text-xs text-muted-foreground">
      {language === 'pt' 
        ? 'Clique em uma imagem para selecioná-la. Imagens fornecidas pelo Unsplash.'
        : 'Click on an image to select it. Images provided by Unsplash.'}
    </p>
  );
};

export default UnsplashAttribution;

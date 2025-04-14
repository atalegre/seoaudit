
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnsplashErrorDisplayProps {
  error: string | null;
}

const UnsplashErrorDisplay: React.FC<UnsplashErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
      {error}
    </div>
  );
};

export default UnsplashErrorDisplay;

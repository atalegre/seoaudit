
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const SpamInstructions = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-sm text-muted-foreground mt-4">
      <p className="font-medium">{t('verify-no-email')}</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>{t('verify-check-spam')}</li>
        <li>{t('verify-add-contact')}</li>
        <li>{t('verify-wait')}</li>
      </ul>
    </div>
  );
};

export default SpamInstructions;

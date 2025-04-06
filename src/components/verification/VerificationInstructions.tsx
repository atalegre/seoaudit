
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VerificationInstructions = () => {
  const { t } = useLanguage();
  
  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        <ExternalLink size={18} className="text-primary" />
        <h4 className="font-medium">{t('verify-next')}</h4>
      </div>
      <ol className="list-decimal list-inside space-y-1 text-sm">
        <li>{t('verify-step1')}</li>
        <li>{t('verify-step2')}</li>
        <li>{t('verify-step3')}</li>
      </ol>
    </div>
  );
};

export default VerificationInstructions;

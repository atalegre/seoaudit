
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface VerificationStatusProps {
  emailSent: boolean;
}

const VerificationStatus = ({ emailSent }: VerificationStatusProps) => {
  const { t } = useLanguage();
  
  if (!emailSent) return null;
  
  return (
    <Alert className="mb-6 border-green-500/50 bg-green-500/10">
      <AlertTitle>{t('verify-email-sent')}</AlertTitle>
      <AlertDescription>
        {t('verify-email-success')}
      </AlertDescription>
    </Alert>
  );
};

export default VerificationStatus;

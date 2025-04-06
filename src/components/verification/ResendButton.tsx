
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResendButtonProps {
  onResend: () => void;
  isResending: boolean;
}

const ResendButton = ({ onResend, isResending }: ResendButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      variant="default" 
      className="w-full"
      onClick={onResend}
      disabled={isResending}
    >
      {isResending ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin mr-2" /> {t('verify-resending')}
        </>
      ) : (
        <>{t('verify-resend')}</>
      )}
    </Button>
  );
};

export default ResendButton;


import React from 'react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useLogout';
import { useLanguage } from '@/contexts/LanguageContext';

const LogoutButton = () => {
  const { handleSignOut } = useLogout();
  const { t } = useLanguage();
  
  return (
    <Button variant="ghost" onClick={handleSignOut}>
      {t('sign-out')}
    </Button>
  );
};

export default LogoutButton;

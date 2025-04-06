
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <Button variant="outline" onClick={() => navigate('/signin', { state: { defaultTab: 'signin' } })}>
      {t('sign-in')}
    </Button>
  );
};

export default LoginButton;

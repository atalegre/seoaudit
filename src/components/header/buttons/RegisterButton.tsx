
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const RegisterButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <Button variant="outline" onClick={() => navigate('/signin', { state: { defaultTab: 'signup' } })}>
      {t('sign-up')}
    </Button>
  );
};

export default RegisterButton;

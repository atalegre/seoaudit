
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LoginButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button variant="outline" onClick={() => navigate('/signin')}>
      Entrar
    </Button>
  );
};

export default LoginButton;

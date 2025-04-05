
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RegisterButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button variant="outline" onClick={() => navigate('/signup')}>
      Registar
    </Button>
  );
};

export default RegisterButton;


import React from 'react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useLogout';

const LogoutButton = () => {
  const { handleSignOut } = useLogout();
  
  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sair
    </Button>
  );
};

export default LogoutButton;

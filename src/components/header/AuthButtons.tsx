
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user, role } = useUser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Always show the button to access the dashboard
  return (
    <div className="flex items-center gap-4">
      <Button variant="default" onClick={() => navigate('/dashboard')}>
        Acessar Dashboard
      </Button>
      {user && <Button variant="ghost" onClick={handleSignOut}>Sair</Button>}
    </div>
  );
};

export default AuthButtons;

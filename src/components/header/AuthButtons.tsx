
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

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => {
            if (role === 'admin') {
              navigate('/dashboard'); // Admin goes to main dashboard
            } else {
              navigate('/dashboard/client'); // Regular users go to client dashboard
            }
          }}
        >
          Dashboard
        </Button>
        <Button variant="ghost" onClick={handleSignOut}>Sair</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <Link to="/signin">Entrar</Link>
      </Button>
      <Button variant="default" asChild>
        <Link to="/signup">Registar</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;

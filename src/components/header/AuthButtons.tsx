
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

  const handleDashboardAccess = () => {
    if (user) {
      // If user is logged in, navigate directly to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, redirect to sign in page
      navigate('/signin');
      
      // You could also show a toast notification explaining why they're being redirected
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!user ? (
        <>
          <Button variant="outline" onClick={() => navigate('/signin')}>
            Entrar
          </Button>
          <Button variant="outline" onClick={() => navigate('/signup')}>
            Registar
          </Button>
        </>
      ) : (
        <Button variant="ghost" onClick={handleSignOut}>Sair</Button>
      )}
      
      {/* Dashboard button that requires login */}
      <Button variant="default" onClick={handleDashboardAccess}>
        Acessar Dashboard
      </Button>
    </div>
  );
};

export default AuthButtons;

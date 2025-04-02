
// This is a new component that we'll add to show login/signup links in the header
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthButtons = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/client')}
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

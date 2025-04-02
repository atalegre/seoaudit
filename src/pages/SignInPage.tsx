
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import SocialAuth from '@/components/auth/SocialAuth';
import SignInForm from '@/components/auth/SignInForm';

const SignInPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const locationState = location.state as { email?: string; returnTo?: string } | null;

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change event:", event);
        console.log("Session:", session);
        setSession(session);
        
        if (session) {
          // Check user role for redirection
          const userRole = session.user.user_metadata?.role;
          console.log("User role:", userRole);
          
          if (userRole === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/dashboard/client');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, locationState]);

  async function signInWithGoogle() {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao iniciar sessão com Google",
          description: error.message,
        });
      }
    } catch (error: any) {
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  }

  async function signInWithGitHub() {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao iniciar sessão com GitHub",
          description: error.message,
        });
      }
    } catch (error: any) {
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  }

  const footerContent = (
    <p className="text-sm text-muted-foreground">
      Não tem uma conta?{' '}
      <Link to="/signup" className="text-primary hover:underline font-medium">
        Registre-se
      </Link>
    </p>
  );

  return (
    <AuthLayout>
      <AuthCard 
        title="Entrar"
        description="Digite suas credenciais para entrar na sua conta"
        footer={footerContent}
      >
        <AuthError error={authError} />
        
        <SocialAuth 
          onGoogleClick={signInWithGoogle}
          onGitHubClick={signInWithGitHub}
          buttonText="Continuar"
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <SignInForm 
          email={locationState?.email} 
          returnTo={locationState?.returnTo}
          setAuthError={setAuthError}
        />
        
        <div className="mt-4 text-center text-sm">
          <Link to="/recuperar-password" className="text-primary hover:underline">
            Esqueceu a password?
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignInPage;

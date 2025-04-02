
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
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
          // User is logged in, redirect to client dashboard by default
          navigate('/dashboard/client');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard/client');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

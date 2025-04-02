
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
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const locationState = location.state as { email?: string; returnTo?: string } | null;

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User is already logged in, redirecting to dashboard");
          navigate('/dashboard/client');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event);
        
        if (session) {
          console.log("User logged in, redirecting");
          navigate('/dashboard/client');
        }
      }
    );

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

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Verificando sessão...</p>
        </div>
      </AuthLayout>
    );
  }

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

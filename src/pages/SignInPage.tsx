
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
          console.log("User is already logged in:", session.user);
          
          // Check if user exists in users table
          const { data: userInTable } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (!userInTable) {
            // Create user record if needed
            const role = session.user.email === 'atalegre@me.com' ? 'admin' : 'user';
            const name = session.user.email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
            
            await supabase.from('users').insert([
              {
                id: session.user.id,
                name: name,
                email: session.user.email,
                role: role
              }
            ]);
            
            console.log(`Created user record for ${session.user.email} with role ${role}`);
          }
          
          // Redirect to dashboard - proper routing based on role will be handled there
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate, toast]);

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

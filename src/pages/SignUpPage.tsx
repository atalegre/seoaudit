
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import SocialAuth from '@/components/auth/SocialAuth';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check user role from metadata and redirect accordingly
        const role = session.user.user_metadata.role || 'user';
        navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
      }
    });
  }, [navigate]);

  async function signUpWithGoogle() {
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
          title: "Erro ao registar com Google",
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

  async function signUpWithGitHub() {
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
          title: "Erro ao registar com GitHub",
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
      Já tem uma conta?{' '}
      <Link to="/signin" className="text-primary hover:underline font-medium">
        Entrar
      </Link>
    </p>
  );

  return (
    <AuthLayout>
      <AuthCard 
        title="Criar Conta"
        description="Preencha os dados abaixo para criar sua conta"
        footer={footerContent}
      >
        <AuthError error={authError} />
        
        <SocialAuth 
          onGoogleClick={signUpWithGoogle}
          onGitHubClick={signUpWithGitHub}
          buttonText="Registar"
        />
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou registe-se com e-mail
            </span>
          </div>
        </div>

        <SignUpForm setAuthError={setAuthError} />
      </AuthCard>
    </AuthLayout>
  );
};

export default SignUpPage;

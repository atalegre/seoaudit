
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import SignInForm from '@/components/auth/SignInForm';

const SignInPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const locationState = location.state as { email?: string; returnTo?: string } | null;

  const handleSkipLogin = () => {
    toast({
      title: "Login ignorado",
      description: "A continuar sem autenticação.",
    });
    navigate('/dashboard');
  };

  // Add a prominent button in the main content area to continue without login
  return (
    <AuthLayout>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Button 
          onClick={handleSkipLogin}
          size="lg" 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3"
        >
          Continuar sem Login → Entrar diretamente no Dashboard
        </Button>
        
        <div className="w-full flex items-center justify-between">
          <div className="w-1/3 border-t border-gray-300"></div>
          <div className="px-3 text-sm text-gray-500">ou</div>
          <div className="w-1/3 border-t border-gray-300"></div>
        </div>
        
        <AuthCard 
          title="Entrar"
          description="Digite suas credenciais para entrar na sua conta"
          footer={
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Não tem uma conta?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Registre-se
                </Link>
              </p>
            </div>
          }
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
      </div>
    </AuthLayout>
  );
};

export default SignInPage;


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

  return (
    <AuthLayout>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
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

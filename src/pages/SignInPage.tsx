
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import SignInForm from '@/components/auth/SignInForm';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const SignInPage = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const location = useLocation();
  const locationState = location.state as { 
    email?: string; 
    returnTo?: string;
    message?: string;
  } | null;

  return (
    <AuthLayout>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {locationState?.message && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription>{locationState.message}</AlertDescription>
          </Alert>
        )}
        
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
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;

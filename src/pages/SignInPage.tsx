
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const SignInPage = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { 
    email?: string; 
    returnTo?: string;
    message?: string;
    defaultTab?: 'signin' | 'signup';
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
          title=""
          description=""
          footer={null}
        >
          <Tabs defaultValue={locationState?.defaultTab || 'signin'} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">{t('sign-in')}</TabsTrigger>
              <TabsTrigger value="signup">{t('sign-up')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">{t('sign-in')}</h1>
                <p className="text-muted-foreground">{t('login-description') || "Digite suas credenciais para entrar na sua conta"}</p>
              </div>
              
              <AuthError error={authError} />
              
              <SignInForm 
                email={locationState?.email} 
                returnTo={locationState?.returnTo}
                setAuthError={setAuthError}
              />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">{t('sign-up')}</h1>
                <p className="text-muted-foreground">{t('signup-description') || "Preencha os dados abaixo para criar sua conta"}</p>
              </div>
              
              <AuthError error={authError} />
              
              <SignUpForm setAuthError={setAuthError} />
            </TabsContent>
          </Tabs>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;

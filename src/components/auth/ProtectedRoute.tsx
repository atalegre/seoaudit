
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const { t } = useLanguage();

  // While checking auth status, show nothing
  if (loading) {
    return null;
  }

  return (
    <>
      {/* Show the children regardless of authentication status */}
      {children}
      
      {/* Apply blur overlay only when not authenticated */}
      {!user && (
        <div className="fixed top-14 left-14 right-0 bottom-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30 pointer-events-none">
          <div className="p-6 bg-white/90 rounded-lg shadow-md pointer-events-auto w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2 text-center">Acesso restrito</h3>
            <p className="text-gray-600 mb-4 text-center">Faça login ou registe-se para aceder a este conteúdo premium.</p>
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="signin">{t('sign-in')}</TabsTrigger>
                <TabsTrigger value="signup">{t('sign-up')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <SignInForm 
                  setAuthError={() => {}} 
                  returnTo={location.pathname}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <SignUpForm 
                  setAuthError={() => {}} 
                  returnTo={location.pathname}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;

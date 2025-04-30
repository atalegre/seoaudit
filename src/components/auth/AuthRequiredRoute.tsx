
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from './LoginDialog';

interface AuthRequiredRouteProps {
  children: React.ReactNode;
}

const AuthRequiredRoute: React.FC<AuthRequiredRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // While checking auth status, show nothing
  if (loading) {
    return null;
  }
  
  // If user is authenticated, show the children
  if (user) {
    return <>{children}</>;
  }
  
  // If user is not authenticated, show login dialog
  return (
    <>
      {React.cloneElement(children as React.ReactElement, { disabled: true })}
      
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
        <div className="p-6 bg-white/95 rounded-lg shadow-md pointer-events-auto w-full max-w-md">
          <h3 className="text-xl font-semibold mb-2 text-center">Acesso restrito</h3>
          <p className="text-gray-600 mb-4 text-center">
            Esta funcionalidade é exclusiva para usuários autenticados.
            Por favor, faça login ou registre-se para acessar este conteúdo premium.
          </p>
          <LoginDialog 
            isOpen={true} 
            onClose={() => {}} 
            returnTo={location.pathname}
          />
        </div>
      </div>
    </>
  );
};

export default AuthRequiredRoute;


import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from './LoginDialog';

interface AuthRequiredRouteProps {
  children: React.ReactNode;
}

const AuthRequiredRoute: React.FC<AuthRequiredRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  
  // While checking auth status, show nothing
  if (loading) {
    return null;
  }
  
  // If user is authenticated, show the children
  if (user) {
    return <>{children}</>;
  }
  
  // If user is not authenticated, show only the page content blurred with login dialog on top
  // Important: The entire layout (top and side bars) should remain fully visible and clickable
  return (
    <>
      {/* This wraps ONLY the page content, not the layout */}
      <div className="relative h-full">
        <div className="filter blur-sm pointer-events-none h-full">
          {children}
        </div>
        
        {/* Overlay with login dialog - fixed positioning for consistent centering */}
        <div className="absolute inset-0 overflow-auto flex items-center justify-center py-12">
          <div className="p-6 bg-white/95 rounded-lg shadow-md w-full max-w-md z-50 mx-auto my-auto">
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
      </div>
    </>
  );
};

export default AuthRequiredRoute;

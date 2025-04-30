
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
  
  // If user is not authenticated, show the page content blurred with login dialog on top
  // Important: The entire layout (top and side bars) remains visible and clickable
  return (
    <div className="relative h-full">
      {/* Render the page content but apply blur */}
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      
      {/* Overlay with login dialog */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="p-6 bg-white/95 rounded-lg shadow-md pointer-events-auto w-full max-w-md z-50">
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
  );
};

export default AuthRequiredRoute;

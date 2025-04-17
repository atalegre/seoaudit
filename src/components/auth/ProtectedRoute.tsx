
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from '@/components/auth/LoginDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If user is not logged in, show login dialog
    if (!loading && !user) {
      setShowLoginDialog(true);
    }
  }, [user, loading]);

  // While checking auth status, show nothing
  if (loading) {
    return null;
  }

  return (
    <>
      {/* Show login dialog if not authenticated */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        returnTo={location.pathname}
      />
      
      {/* Render the protected content */}
      <div className={!user ? 'relative' : ''}>
        {children}
        
        {/* Apply blur overlay if not authenticated */}
        {!user && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-2">Acesso restrito</h3>
              <p className="text-gray-600">Faça login para acessar este conteúdo premium.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProtectedRoute;

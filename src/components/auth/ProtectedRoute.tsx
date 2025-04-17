
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
      
      {/* Show the children regardless of authentication status */}
      {children}
      
      {/* Apply blur overlay only to the main content area when not authenticated */}
      {!user && (
        <div className="fixed top-14 left-14 right-0 bottom-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center p-6 bg-white/90 rounded-lg shadow-md pointer-events-auto">
            <h3 className="text-xl font-semibold mb-2">Acesso restrito</h3>
            <p className="text-gray-600 mb-4">Faça login para acessar este conteúdo premium.</p>
            <button 
              onClick={() => setShowLoginDialog(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Fazer login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;

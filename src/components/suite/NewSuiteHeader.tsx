
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useLogout } from '@/hooks/useLogout';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface NewSuiteHeaderProps {
  title?: string;
  domain?: string;
  lastAnalysisDate?: string;
  showBackButton?: boolean;
}

const NewSuiteHeader = ({ 
  title, 
  domain, 
  lastAnalysisDate, 
  showBackButton = false 
}: NewSuiteHeaderProps) => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { handleSignOut } = useLogout();
  const { t } = useLanguage();
  const [localLoading, setLocalLoading] = useState(true);

  // Debug auth state on mount and whenever user changes
  useEffect(() => {
    console.log("NewSuiteHeader - Auth state:", { 
      user, 
      loading, 
      isAuthenticated: !!user,
      userEmail: user?.email || 'no email' 
    });
    
    // Ensure loading state resolves locally after a short delay
    const localTimer = setTimeout(() => {
      setLocalLoading(false);
    }, 500);
    
    return () => clearTimeout(localTimer);
  }, [user, loading]);
  
  // When context loading changes, update local loading
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading]);

  const handleLogout = async () => {
    try {
      await handleSignOut();
      toast.success(t('logout-success') || "Logout realizado com sucesso");
      navigate('/signin');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t('logout-error') || "Erro ao fazer logout");
    }
  };

  return (
    <header className="bg-white border-b p-4 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/suite')}
              className="mr-2 flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back') || 'Back'}
            </Button>
          )}
          
          <div>
            <h1 className="text-xl font-semibold">{title || 'Dashboard'}</h1>
            {domain && <p className="text-sm text-gray-500">{domain}</p>}
            {lastAnalysisDate && (
              <p className="text-xs text-gray-400">
                {t('last-analysis')}: {lastAnalysisDate}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {localLoading ? (
            <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span>{t('sign-out') || "Sair"}</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/signin')}
              className="flex items-center"
            >
              <LogIn className="h-4 w-4 mr-1" />
              <span>{t('sign-in') || "Entrar"}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NewSuiteHeader;

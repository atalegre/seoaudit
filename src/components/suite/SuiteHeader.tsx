
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, LogIn, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLogout } from '@/hooks/useLogout';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface SuiteHeaderProps {
  title?: string;
  domain?: string;
  lastAnalysisDate?: string;
  showBackButton?: boolean;
}

const SuiteHeader = ({ 
  title, 
  domain, 
  lastAnalysisDate, 
  showBackButton = false
}: SuiteHeaderProps) => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { handleSignOut } = useLogout();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await handleSignOut();
    toast.success(t('logout-success') || "Logout realizado com sucesso");
    navigate('/signin');
  };

  // Enhanced auth status debugging
  useEffect(() => {
    console.log("SuiteHeader - Auth state:", { 
      user, 
      loading, 
      isAuthenticated: !!user,
      userEmail: user?.email || 'no email' 
    });
  }, [user, loading]);

  return (
    <header className="bg-white border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/suite')}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back')}
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
          {/* Authentication status display */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{user.email}</span>
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

export default SuiteHeader;

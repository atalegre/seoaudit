
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
  onRerunAnalysis?: () => void;
  isAnalyzing?: boolean;
}

const SuiteHeader = ({ 
  title, 
  domain, 
  lastAnalysisDate, 
  showBackButton = false,
  onRerunAnalysis,
  isAnalyzing = false
}: SuiteHeaderProps) => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { handleSignOut } = useLogout();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await handleSignOut();
    toast.success("Logout realizado com sucesso");
  };

  // Simple auth status debugging
  useEffect(() => {
    console.log("SuiteHeader - User state updated:", { user, loading });
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
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <>
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
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span>{t('sign-out')}</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/signin')}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>{t('sign-in')}</span>
                </Button>
              )}
            </>
          )}
          
          {onRerunAnalysis && (
            <Button 
              onClick={onRerunAnalysis} 
              disabled={isAnalyzing}
              className="ml-2"
            >
              {isAnalyzing ? t('analyzing') || 'Analisando...' : t('analyze-again') || 'Analisar Novamente'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuiteHeader;

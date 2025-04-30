
import React from 'react';
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

  console.log("SuiteHeader - User state:", { user, loading });

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
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/suite/profile')}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user.email || 'Usuário'}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">{t('sign-out')}</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/signin')}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('sign-in')}</span>
                </Button>
              )}
            </>
          )}
          
          {onRerunAnalysis && (
            <Button 
              onClick={onRerunAnalysis} 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analisando...' : 'Analisar Novamente'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuiteHeader;

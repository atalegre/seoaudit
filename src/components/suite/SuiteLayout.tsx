
import React, { ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarContentItems from './SidebarContent';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, RefreshCw, Menu, ChevronRight } from 'lucide-react';

interface SuiteLayoutProps {
  children: ReactNode;
  title?: string;
  domain?: string;
  lastAnalysisDate?: string;
  onRerunAnalysis?: () => void;
  isAnalyzing?: boolean;
}

const SuiteLayout = ({ 
  children, 
  title = "Dashboard", 
  domain = "", 
  lastAnalysisDate = "",
  onRerunAnalysis,
  isAnalyzing = false
}: SuiteLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogin = () => {
    navigate('/signin', { 
      state: { returnTo: window.location.pathname }
    });
  };

  const handleLogout = () => {
    // Code for logout will be implemented in another file
    toast.success("Logout realizado com sucesso");
    navigate('/');
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar - Fixed narrow sidebar */}
        <div id="sidebar-navigation" className="fixed inset-y-0 left-0 z-50 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <div className="flex-1 flex flex-col items-center space-y-4">
            {/* Logo at top - Make it clickable to go to home */}
            <Link to="/" className="p-2 cursor-pointer">
              <img 
                src="/lovable-uploads/d5a32965-2a6a-49a6-8474-6efb96afd0f7.png" 
                alt="SEOAudit Logo" 
                className="h-8 w-auto" 
              />
            </Link>
            
            {/* Icon navigation */}
            <nav className="flex-1 w-full px-2 mt-6">
              <SidebarContentItems />
            </nav>
          </div>
          
          {/* User/login at bottom */}
          <div className="mt-auto">
            {!user ? (
              <Button 
                onClick={handleLogin} 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </Button>
            ) : (
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </Button>
            )}
          </div>
        </div>

        {/* Main content - with left padding to account for sidebar */}
        <div className="flex-1 flex flex-col pl-16">
          {/* Top header bar */}
          <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-medium">{title}</h2>
                {domain && (
                  <div className="flex items-center ml-2 text-sm text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                    <span>{domain}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {lastAnalysisDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Última análise: {lastAnalysisDate}</span>
                  </div>
                )}
                {onRerunAnalysis && (
                  <Button 
                    onClick={onRerunAnalysis} 
                    size="sm"
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Executar nova auditoria
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SuiteLayout;

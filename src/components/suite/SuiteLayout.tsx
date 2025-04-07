
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { SidebarTrigger } from "@/components/ui/sidebar";
import SidebarContentItems from './SidebarContent';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, RefreshCw } from 'lucide-react';

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
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="group peer hidden md:block" data-state="expanded" data-collapsible="" data-variant="sidebar" data-side="left">
        {/* Sidebar spacing element */}
        <div className="relative h-svh w-[4rem] hover:w-[14rem] transition-all duration-200 ease-in-out"></div>

        {/* Fixed sidebar container */}
        <div className="fixed inset-y-0 z-30 hidden h-svh w-[4rem] hover:w-[14rem] transition-all duration-200 ease-in-out md:flex left-0">
          {/* Sidebar content */}
          <div data-sidebar="sidebar" className="flex h-full w-full flex-col border-r border-gray-200 bg-white">
            {/* Sidebar header with logo */}
            <div className="flex items-center justify-center h-14 border-b py-2 px-2">
              <img 
                src="/lovable-uploads/d5a32965-2a6a-49a6-8474-6efb96afd0f7.png" 
                alt="SEOAudit Logo" 
                className="h-6" 
              />
            </div>
            
            {/* Sidebar menu items */}
            <nav className="flex-1 px-2 py-4 space-y-2">
              <SidebarContentItems />
            </nav>
            
            {/* Sidebar footer */}
            <div className="px-2 py-2 border-t">
              {!user ? (
                <Button 
                  onClick={handleLogin} 
                  variant="outline" 
                  className="w-full justify-start text-xs h-7 py-1"
                  size="sm"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span className="sidebar-label">Login</span>
                </Button>
              ) : (
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full justify-start text-xs h-7 py-1"
                  size="sm"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span className="sidebar-label">Logout</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-[4rem]">
        {/* Header */}
        <header className="flex h-14 items-center border-b px-4 lg:px-6 sticky top-0 bg-background z-10">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {domain && <p className="text-sm text-muted-foreground">{domain}</p>}
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
        <div className="flex-1 p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SuiteLayout;

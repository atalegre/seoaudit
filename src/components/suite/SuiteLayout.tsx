
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar className="shrink-0 border-r" variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="flex items-center justify-center h-14 border-b py-2 px-2">
            <img 
              src="/lovable-uploads/d5a32965-2a6a-49a6-8474-6efb96afd0f7.png" 
              alt="SEOAudit Logo" 
              className="h-6" 
            />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 py-1 text-xs text-muted-foreground">Menu Principal</SidebarGroupLabel>
              <SidebarContentItems />
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="px-2 py-2 border-t">
            {!user ? (
              <Button 
                onClick={handleLogin} 
                variant="outline" 
                className="w-full justify-start text-xs h-7 py-1"
                size="sm"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Login</span>
              </Button>
            ) : (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full justify-start text-xs h-7 py-1"
                size="sm"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:px-6">
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
          </div>
          <div className="flex-1 p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SuiteLayout;

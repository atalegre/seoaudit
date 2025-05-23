
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardContent from '@/components/dashboard/client/DashboardContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast: hookToast } = useToast();
  const { user, userEmail } = useAuthCheck();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // Get url parameter if present
  const urlParam = searchParams.get('url');
  const projectIdParam = searchParams.get('projectId');
  
  useEffect(() => {
    // Store URL parameter in localStorage for persistence
    if (urlParam) {
      console.log("Storing URL parameter in localStorage:", urlParam);
      localStorage.setItem('lastAnalyzedUrl', urlParam);
    }
    
    // Store projectId parameter in localStorage if present
    if (projectIdParam) {
      console.log("Storing projectId parameter in localStorage:", projectIdParam);
      localStorage.setItem('lastProjectId', projectIdParam);
    }
    
    // Check auth state when component mounts
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log("No active session, proceeding as anonymous user");
          setIsAuthChecked(true);
          toast.success("Dashboard carregado (modo anônimo)", {
            description: "Acesso limitado disponível para demonstração."
          });
        } else {
          setIsAuthChecked(true);
          console.log("Auth checked, user is logged in:", data.session.user.email);
          toast.success("Dashboard carregado", {
            description: "Os seus dados foram carregados com sucesso."
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Erro de autenticação", {
          description: "Ocorreu um erro ao verificar a sua sessão."
        });
        setIsAuthChecked(true); // Ainda assim, consideramos checado para continuar
      }
    };
    
    checkAuth();
  }, [navigate, location, urlParam, projectIdParam]);
  
  const {
    clients,
    clientReports,
    notifications,
    seoScore,
    aioScore,
    isLoading,
    scoreDiff,
    lastUpdate,
    implementedRecommendations,
    totalRecommendations,
    selectedClientId,
    fetchClientData,
    handleMarkAsRead
  } = useDashboardData(undefined, userEmail || "Anonymous");

  const handleLogout = () => {
    hookToast({
      title: "Sessão terminada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
  };

  const handleWebsiteAdded = () => {
    fetchClientData();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Gerencie seus websites e analise o desempenho</p>
        </div>
        
        <DashboardContent 
          isLoading={isLoading || !isAuthChecked}
          clients={clients}
          selectedClientId={selectedClientId}
          seoScore={seoScore}
          aioScore={aioScore}
          scoreDiff={scoreDiff}
          lastUpdate={lastUpdate}
          implementedRecommendations={implementedRecommendations}
          totalRecommendations={totalRecommendations}
          clientReports={clientReports}
          notifications={notifications}
          handleMarkAsRead={handleMarkAsRead}
          onWebsiteAdded={handleWebsiteAdded}
          userEmail={userEmail || "Anonymous"}
        />
      </main>
    </div>
  );
};

export default ClientDashboardPage;

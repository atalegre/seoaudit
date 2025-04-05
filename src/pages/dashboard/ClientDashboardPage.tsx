
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardContent from '@/components/dashboard/client/DashboardContent';
import { supabase } from '@/integrations/supabase/client';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, userEmail } = useAuthCheck();
  
  useEffect(() => {
    // Check auth state when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("No active session, redirecting to signin");
        navigate('/signin', { 
          state: { 
            returnTo: location.pathname + location.search,
            message: "Faça login para acessar o dashboard"
          }
        });
      }
    };
    
    checkAuth();
  }, [navigate, location]);
  
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
  } = useDashboardData(undefined, userEmail);

  const handleLogout = () => {
    toast({
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
          isLoading={isLoading}
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
          userEmail={userEmail}
        />
      </main>
    </div>
  );
};

export default ClientDashboardPage;

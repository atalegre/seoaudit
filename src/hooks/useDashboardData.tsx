
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClientDataFetching } from './dashboard/useClientDataFetching';
import { useClientAnalysis } from './dashboard/useClientAnalysis';
import { useNotifications } from './dashboard/useNotifications';

export const useDashboardData = (
  id?: string, 
  userEmail?: string
) => {
  const [searchParams] = useSearchParams();
  
  // Get URL from params or localStorage
  const urlParam = searchParams.get('url');
  const storedUrl = localStorage.getItem('lastAnalyzedUrl');
  const targetUrl = urlParam || storedUrl || '';
  
  // Initialize sub-hooks
  const clientId = id ? parseInt(id) : null;
  const {
    clients,
    isLoading,
    selectedClientId,
    setSelectedClientId,
    fetchClientData
  } = useClientDataFetching(targetUrl, userEmail, clientId);
  
  const {
    seoScore,
    aioScore,
    scoreDiff,
    lastUpdate,
    implementedRecommendations,
    totalRecommendations,
    clientReports,
    fetchAnalysisData
  } = useClientAnalysis();
  
  const {
    notifications,
    handleMarkAsRead,
    generateNotifications
  } = useNotifications();
  
  // Main fetch function that orchestrates the data fetching process
  const fetchAllDashboardData = async () => {
    try {
      const clientData = await fetchClientData();
      
      if (!clientData) {
        // Set default welcome notification if no client data
        generateNotifications(null, {
          id: 1,
          title: 'Bem-vindo ao Dashboard',
          description: 'Adicione o seu primeiro website para começar as análises.',
          date: new Date().toLocaleDateString(),
          read: false,
          urgent: false
        });
        return;
      }
      
      // Now fetch analysis data for this client
      await fetchAnalysisData(clientData);
      
      // Generate notifications based on the latest report
      if (clientData.lastAnalysis) {
        const history = await getClientAnalysisHistory(clientData.id);
        if (history && history.length > 0) {
          const sortedHistory = [...history].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          generateNotifications(sortedHistory[0]);
        } else {
          generateNotifications(null, {
            id: 1,
            title: 'Bem-vindo ao Dashboard',
            description: 'Seu site foi analisado. Confira os resultados acima.',
            date: new Date().toLocaleDateString(),
            read: false,
            urgent: false
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchAllDashboardData:', error);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    if (targetUrl) {
      console.log("Initial fetch with target URL:", targetUrl);
    }
    fetchAllDashboardData();
  }, [id, userEmail]);
  
  return {
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
    setSelectedClientId,
    fetchClientData: fetchAllDashboardData,
    handleMarkAsRead
  };
};

// Missing import for the getClientAnalysisHistory function
import { getClientAnalysisHistory } from '@/utils/api';

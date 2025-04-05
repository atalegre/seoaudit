
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getClientAnalysisHistory, getClientsFromDatabase } from '@/utils/api';
import { Client } from '@/utils/api/types';

interface DashboardDataReturn {
  clients: Client[];
  clientReports: any[];
  notifications: any[];
  seoScore: number;
  aioScore: number;
  isLoading: boolean;
  scoreDiff: { seo: number; aio: number };
  lastUpdate: string;
  implementedRecommendations: number;
  totalRecommendations: number;
  selectedClientId: number | null;
  setSelectedClientId: (id: number | null) => void;
  fetchClientData: () => Promise<void>;
  handleMarkAsRead: (notificationId: number) => void;
}

export const useDashboardData = (
  id?: string, 
  userEmail?: string
): DashboardDataReturn => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientReports, setClientReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [seoScore, setSeoScore] = useState(0);
  const [aioScore, setAioScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreDiff, setScoreDiff] = useState({ seo: 0, aio: 0 });
  const [lastUpdate, setLastUpdate] = useState('');
  const [implementedRecommendations, setImplementedRecommendations] = useState(0);
  const [totalRecommendations, setTotalRecommendations] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Check URL parameters for a specific website
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParameter = urlParams.get('url');
    
    if (urlParameter) {
      console.log("Found URL parameter:", urlParameter);
      localStorage.setItem('lastAnalyzedUrl', urlParameter);
    }
  }, []);
  
  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      
      // Get client ID from URL params or fetch all client websites
      const clientId = id ? parseInt(id) : null;
      const clientsData = await getClientsFromDatabase();
      console.log("Fetched clients:", clientsData);
      
      // Get the URL from local storage if available
      const lastAnalyzedUrl = localStorage.getItem('lastAnalyzedUrl');
      
      // Filter clients by user account if available
      let userClients = userEmail 
        ? clientsData.filter((client: Client) => client.account === userEmail)
        : clientsData;
      
      console.log("User email:", userEmail);
      console.log("Filtered clients for user:", userClients);
      
      // If no clients found for this user but we have a lastAnalyzedUrl,
      // try finding it in all clients
      if ((!userClients || userClients.length === 0) && lastAnalyzedUrl) {
        console.log("No clients found for user, trying to find by URL:", lastAnalyzedUrl);
        const matchingClient = clientsData.find((client: Client) => 
          client.website === lastAnalyzedUrl || 
          client.website === lastAnalyzedUrl.replace(/^https?:\/\//, '')
        );
        
        if (matchingClient) {
          console.log("Found matching client by URL:", matchingClient);
          userClients = [matchingClient];
        }
      }
      
      setClients(userClients);
      
      if (!userClients || userClients.length === 0) {
        console.log("No clients found for this user");
        setNotifications([{
          id: 1,
          title: 'Bem-vindo ao Dashboard',
          description: 'Adicione o seu primeiro website para começar as análises.',
          date: new Date().toLocaleDateString(),
          read: false,
          urgent: false
        }]);
        setIsLoading(false);
        return;
      }
      
      // If no specific client ID is provided, use the first one or the selected one
      const targetClientId = clientId || selectedClientId || userClients[0]?.id;
      if (targetClientId) {
        setSelectedClientId(targetClientId);
      }
      
      console.log("Target client ID:", targetClientId);
      
      // Get the client data
      const clientData = userClients.find(c => c.id === targetClientId);
      if (!clientData) {
        console.log("Client not found with ID:", targetClientId);
        setIsLoading(false);
        return;
      }
      
      console.log("Client found:", clientData);
      
      // Use data from the client object if no history is available
      setSeoScore(clientData.seoScore || 0);
      setAioScore(clientData.aioScore || 0);
      
      // Set last update date from the client if available
      if (clientData.lastAnalysis) {
        const lastAnalysisDate = new Date(clientData.lastAnalysis);
        setLastUpdate(lastAnalysisDate.toLocaleDateString());
      }
      
      // Fetch analysis history for this client
      const history = await getClientAnalysisHistory(targetClientId);
      console.log("Analysis history:", history);
      
      if (history && history.length > 0) {
        // Ordenar do mais recente para o mais antigo
        const sortedHistory = [...history].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Pegar o mais recente
        const latestReport = sortedHistory[0];
        console.log("Latest report:", latestReport);
        
        // Atualizar scores
        setSeoScore(latestReport.seo.score || 0);
        setAioScore(latestReport.aio.score || 0);
        
        // Atualizar última atualização
        setLastUpdate(new Date(latestReport.timestamp).toLocaleDateString());
        
        // Calcular diferença se houver pelo menos 2 relatórios
        if (sortedHistory.length > 1) {
          const previousReport = sortedHistory[1];
          setScoreDiff({
            seo: (latestReport.seo.score || 0) - (previousReport.seo.score || 0),
            aio: (latestReport.aio.score || 0) - (previousReport.aio.score || 0)
          });
        }
        
        // Contar recomendações
        if (latestReport.recommendations) {
          setTotalRecommendations(latestReport.recommendations.length);
          const implemented = latestReport.recommendations.filter((r: any) => r.status === 'done').length;
          setImplementedRecommendations(implemented);
        }
        
        // Formatar relatórios para exibição
        const formattedReports = sortedHistory.slice(0, 4).map((report, index) => ({
          id: index + 1,
          name: `Relatório ${(report.seo.score || 0) > (report.aio.score || 0) ? 'SEO' : 'AIO'} ${new Date(report.timestamp).toLocaleDateString()}`,
          date: new Date(report.timestamp).toLocaleDateString(),
          status: 'completed',
          type: (report.seo.score || 0) > (report.aio.score || 0) ? 'SEO' : 'AIO'
        }));
        
        setClientReports(formattedReports);
        
        // Notificações baseadas em análise real
        const newNotifications = [];
        if ((latestReport.seo.score || 0) < 60) {
          newNotifications.push({
            id: 1,
            title: 'Score SEO baixo',
            description: 'Seu site precisa de melhorias urgentes de SEO.',
            date: new Date(latestReport.timestamp).toLocaleDateString(),
            read: false,
            urgent: true
          });
        }
        
        if (latestReport.recommendations && latestReport.recommendations.length > 0) {
          newNotifications.push({
            id: 2,
            title: 'Novas recomendações disponíveis',
            description: `${latestReport.recommendations.length} recomendações para melhorar seu site.`,
            date: new Date(latestReport.timestamp).toLocaleDateString(),
            read: false,
            urgent: false
          });
        }
        
        if (newNotifications.length > 0) {
          setNotifications(newNotifications);
        } else {
          setNotifications([{
            id: 1,
            title: 'Bem-vindo ao Dashboard',
            description: 'Aqui você pode acompanhar o desempenho do seu site.',
            date: new Date().toLocaleDateString(),
            read: false,
            urgent: false
          }]);
        }
      } else {
        console.log("No history for this client");
        // Default notifications if no history
        setNotifications([{
          id: 1,
          title: 'Bem-vindo ao Dashboard',
          description: 'Seu site foi analisado. Confira os resultados acima.',
          date: new Date().toLocaleDateString(),
          read: false,
          urgent: false
        }]);
        
        // Create a basic report entry
        setClientReports([{
          id: 1,
          name: `Análise inicial ${new Date().toLocaleDateString()}`,
          date: new Date().toLocaleDateString(),
          status: 'completed',
          type: clientData.seoScore > clientData.aioScore ? 'SEO' : 'AIO'
        }]);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchClientData();
  }, [id, selectedClientId, userEmail]);
  
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
    fetchClientData,
    handleMarkAsRead
  };
};

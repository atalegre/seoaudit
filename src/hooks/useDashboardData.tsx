
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
  
  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      
      // Get client ID from URL params or fetch all client websites
      const clientId = id ? parseInt(id) : null;
      const clientsData = await getClientsFromDatabase();
      console.log("Fetched clients:", clientsData);
      
      // Filter clients by user account if available
      const userClients = userEmail 
        ? clientsData.filter((client: Client) => client.account === userEmail)
        : clientsData;
      
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
        // Não há histórico para este cliente
        setNotifications([{
          id: 1,
          title: 'Bem-vindo ao Dashboard',
          description: 'Faça sua primeira análise para ver os resultados aqui.',
          date: new Date().toLocaleDateString(),
          read: false,
          urgent: false
        }]);
        
        // Set scores from client data if available
        if (clientData.seoScore) setSeoScore(clientData.seoScore);
        if (clientData.aioScore) setAioScore(clientData.aioScore);
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
  }, [id, selectedClientId]);
  
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

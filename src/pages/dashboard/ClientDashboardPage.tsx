import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { FileText, BarChart2, Bell, AlertTriangle, ExternalLink, FileCheck2 } from 'lucide-react';
import { getClientAnalysisHistory, getClientsFromDatabase } from '@/utils/api';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [clientReports, setClientReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [seoScore, setSeoScore] = useState(0);
  const [aioScore, setAioScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreDiff, setScoreDiff] = useState({ seo: 0, aio: 0 });
  const [lastUpdate, setLastUpdate] = useState('');
  const [implementedRecommendations, setImplementedRecommendations] = useState(0);
  const [totalRecommendations, setTotalRecommendations] = useState(0);
  
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Get client ID from URL params or fetch the first client
        const clientId = id ? parseInt(id) : null;
        let clients = await getClientsFromDatabase();
        console.log("Fetched clients:", clients);
        
        if (!clients || clients.length === 0) {
          console.log("No clients found");
          setNotifications([{
            id: 1,
            title: 'Bem-vindo ao Dashboard',
            description: 'Configure seu perfil para começar as análises.',
            date: new Date().toLocaleDateString(),
            read: false,
            urgent: false
          }]);
          setIsLoading(false);
          return;
        }
        
        // If no specific client ID is provided, use the first one
        const targetClientId = clientId || clients[0].id;
        console.log("Target client ID:", targetClientId);
        
        // Get the client data
        const clientData = clients.find(c => c.id === targetClientId);
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
            const implemented = latestReport.recommendations.filter(r => r.status === 'done').length;
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
    
    fetchClientData();
  }, [toast, id]);
  
  const handleLogout = () => {
    toast({
      title: "Sessão terminada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard do Cliente</h1>
            <p className="text-muted-foreground mt-1">Bem-vindo à sua área de cliente</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Carregando dados...</h2>
              <p className="text-muted-foreground">Por favor, aguarde enquanto buscamos as informações.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Score SEO</CardTitle>
                  <CardDescription>
                    Pontuação atual do seu site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-4xl font-bold">{seoScore}</div>
                    {scoreDiff.seo !== 0 && (
                      <div className={`ml-2 text-sm font-medium ${scoreDiff.seo > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {scoreDiff.seo > 0 ? '+' : ''}{scoreDiff.seo} pts
                      </div>
                    )}
                  </div>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${seoScore}%` }}></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Última atualização: {lastUpdate || 'Sem dados'}
                  </p>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Score AIO</CardTitle>
                  <CardDescription>
                    Pontuação para IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-4xl font-bold">{aioScore}</div>
                    {scoreDiff.aio !== 0 && (
                      <div className={`ml-2 text-sm font-medium ${scoreDiff.aio > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {scoreDiff.aio > 0 ? '+' : ''}{scoreDiff.aio} pts
                      </div>
                    )}
                  </div>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${aioScore}%` }}></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Última atualização: {lastUpdate || 'Sem dados'}
                  </p>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Melhorias implementadas</CardTitle>
                  <CardDescription>
                    Total de recomendações aplicadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{implementedRecommendations}</div>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: totalRecommendations ? `${(implementedRecommendations / totalRecommendations) * 100}%` : '0%' }}></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {totalRecommendations} recomendações no total
                  </p>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {/* Reports Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>
                    Lista de relatórios disponíveis para o seu site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientReports.length > 0 ? (
                    <ul className="space-y-4">
                      {clientReports.map((report: any) => (
                        <li key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {report.type === 'SEO' ? (
                              <BarChart2 className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-purple-500" />
                            )}
                            <div>
                              <p className="font-medium">{report.name}</p>
                              <p className="text-sm text-muted-foreground">{report.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Ainda não há relatórios disponíveis.</p>
                      <p className="mt-2">Faça sua primeira análise para ver os resultados aqui.</p>
                    </div>
                  )}
                </CardContent>
                {clientReports.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver todos os relatórios
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Atualizações e alertas sobre o seu site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {notifications.map((notification: any) => (
                      <li 
                        key={notification.id} 
                        className={`flex gap-3 p-3 rounded-lg ${notification.read ? 'bg-muted/50' : 'bg-muted'} ${notification.urgent ? 'border-l-4 border-red-500' : ''}`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {notification.urgent ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : notification.read ? (
                            <Bell className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Bell className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.date}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          {!notification.read && (
                            <div className="mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-xs"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <FileCheck2 className="h-3 w-3 mr-1" />
                                Marcar como lida
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {notifications.length > 3 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver todas as notificações
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ClientDashboardPage;

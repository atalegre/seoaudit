
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { FileText, BarChart2, Bell, AlertTriangle, ExternalLink, FileCheck2 } from 'lucide-react';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Sessão terminada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
  };
  
  // Mock data for client reports
  const clientReports = [
    { id: 1, name: 'Relatório SEO Mensal', date: '15 Out 2023', status: 'completed', type: 'SEO' },
    { id: 2, name: 'Relatório AIO Mensal', date: '15 Out 2023', status: 'completed', type: 'AIO' },
    { id: 3, name: 'Relatório SEO Mensal', date: '15 Set 2023', status: 'completed', type: 'SEO' },
    { id: 4, name: 'Relatório AIO Mensal', date: '15 Set 2023', status: 'completed', type: 'AIO' },
  ];
  
  // Mock data for notifications
  const notifications = [
    { id: 1, title: 'Novo relatório disponível', description: 'O relatório SEO mensal de Outubro está disponível.', date: '16 Out 2023', read: false, urgent: false },
    { id: 2, title: 'Recomendações atualizadas', description: 'Novas recomendações foram adicionadas ao seu site.', date: '12 Out 2023', read: true, urgent: false },
    { id: 3, title: 'Aviso importante', description: 'Detectamos uma queda significativa no tráfego do seu site.', date: '10 Out 2023', read: false, urgent: true },
  ];

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
                <div className="text-4xl font-bold">82</div>
                <div className="ml-2 text-sm font-medium text-green-500">+5 pts</div>
              </div>
              <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '82%' }}></div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Última atualização: 15 Out 2023
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
                <div className="text-4xl font-bold">75</div>
                <div className="ml-2 text-sm font-medium text-green-500">+8 pts</div>
              </div>
              <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '75%' }}></div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Última atualização: 15 Out 2023
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
              <div className="text-4xl font-bold">12</div>
              <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '60%' }}></div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                20 recomendações no total
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
              <ul className="space-y-4">
                {clientReports.map((report) => (
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
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todos os relatórios
              </Button>
            </CardFooter>
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
                {notifications.map((notification) => (
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
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
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
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todas as notificações
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboardPage;

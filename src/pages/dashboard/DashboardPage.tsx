import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AlertCircle, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClientsFromDatabase } from '@/utils/api/clientService';
import { Client } from '@/utils/api/types';
import { toast } from 'sonner';

const alerts = [
  {
    id: 1,
    website: 'designstudio.pt',
    message: 'Este site piorou 8 pontos no SEO.',
    type: 'warning',
    date: '2023-10-14'
  },
  {
    id: 2,
    website: 'citytours.pt',
    message: 'Nova recomendação AIO gerada.',
    type: 'info',
    date: '2023-10-08'
  },
  {
    id: 3,
    website: 'ecoshop.pt',
    message: 'Este site melhorou 5 pontos no AIO.',
    type: 'success',
    date: '2023-10-10'
  },
];

const DashboardPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsData = await getClientsFromDatabase();
        console.log('Fetched clients for dashboard:', clientsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients for dashboard:', error);
        toast.error('Erro ao carregar clientes');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  const filteredWebsites = clients.filter((website) => {
    const matchesStatus = statusFilter === 'all' || website.status === statusFilter;
    const matchesAccount = accountFilter === 'all' || website.account === accountFilter;
    return matchesStatus && matchesAccount;
  });
  
  const accounts = [...new Set(clients.map(site => site.account))];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'crítico':
      case 'critical':
        return <Badge variant="destructive">{status}</Badge>;
      case 'melhorou':
      case 'improved':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'saudável':
      case 'healthy':
        return <Badge className="bg-green-700">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getClientsCountByStatus = (status: string) => {
    if (status === 'critical' || status === 'crítico') {
      return clients.filter(c => c.status === 'critical' || c.status === 'crítico').length;
    }
    if (status === 'stable' || status === 'estável') {
      return clients.filter(c => c.status === 'stable' || c.status === 'estável').length;
    }
    if (status === 'healthy' || status === 'saudável' || status === 'improved' || status === 'melhorou') {
      return clients.filter(c => 
        c.status === 'healthy' || c.status === 'saudável' || 
        c.status === 'improved' || c.status === 'melhorou'
      ).length;
    }
    return 0;
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Filtrar por estado</span>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="crítico">Crítico</SelectItem>
                  <SelectItem value="estável">Estável</SelectItem>
                  <SelectItem value="melhorou">Melhorou</SelectItem>
                  <SelectItem value="saudável">Saudável</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Filtrar por account</span>
              <Select
                value={accountFilter}
                onValueChange={setAccountFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Websites Analisados</CardTitle>
              <CardDescription>
                Lista de todos os websites analisados e suas métricas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Carregando websites...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>SEO Score</TableHead>
                      <TableHead>AIO Score</TableHead>
                      <TableHead>Última Análise</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWebsites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Nenhum website encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWebsites.map((website) => (
                        <TableRow key={website.id}>
                          <TableCell className="font-medium">{website.name}</TableCell>
                          <TableCell>{website.website}</TableCell>
                          <TableCell className={cn("font-medium", getScoreColor(website.seoScore || 0))}>
                            {website.seoScore || 0}
                          </TableCell>
                          <TableCell className={cn("font-medium", getScoreColor(website.aioScore || 0))}>
                            {website.aioScore || 0}
                          </TableCell>
                          <TableCell>{website.lastAnalysis ? new Date(website.lastAnalysis).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell>{getStatusBadge(website.status || 'pending')}</TableCell>
                          <TableCell>{website.account}</TableCell>
                          <TableCell className="text-right">
                            <Link 
                              to={`/dashboard/client/${website.id}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              Ver detalhes
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
              <CardDescription>
                Alertas automáticos de alterações nos websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-start gap-4 p-3 border rounded-lg"
                  >
                    {alert.type === 'warning' && (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    {alert.type === 'info' && (
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                    )}
                    {alert.type === 'success' && (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{alert.website}</h4>
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
              <CardDescription>
                Visão geral dos websites analisados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <div className="text-sm text-muted-foreground">Websites Total</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {getClientsCountByStatus('critical')}
                  </div>
                  <div className="text-sm text-muted-foreground">Em estado crítico</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-amber-500">
                    {getClientsCountByStatus('stable')}
                  </div>
                  <div className="text-sm text-muted-foreground">Estáveis</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {getClientsCountByStatus('healthy')}
                  </div>
                  <div className="text-sm text-muted-foreground">Saudáveis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowDown, 
  ArrowUp,
  ChevronRight, 
  FileCheck, 
  Mail, 
  RefreshCw, 
  Zap
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  Tooltip 
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  getClientAnalysisHistory,
  getClientsFromDatabase,
  getFullAnalysis,
  saveAnalysisResult,
  updateClientInDatabase
} from '@/utils/api';
import { Client } from '@/utils/api/types';

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    async function fetchClientData() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const clients = await getClientsFromDatabase();
        const clientData = clients.find(c => c.id === Number(id));
        
        if (clientData) {
          setClient(clientData);
          
          const history = await getClientAnalysisHistory(clientData.id);
          
          const formattedHistory = history.map(item => ({
            date: new Date(item.timestamp).toISOString().split('T')[0],
            seoScore: item.seo.score,
            aioScore: item.aio.score
          }));
          
          setHistoricalData(formattedHistory);
          
          if (history.length > 0) {
            const latestAnalysis = history[0];
            setRecommendations(latestAnalysis.recommendations || []);
          } else {
            setRecommendations([]);
          }
          
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente.",
          variant: "destructive"
        });
        setRecommendations([]);
        setHistoricalData([]);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClientData();
  }, [id]);
  
  const handleTaskStatusChange = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'done' ? 'pending' : 'done' }
          : task
      )
    );
    
    toast({
      title: "Tarefa atualizada",
      description: "O status da tarefa foi alterado com sucesso.",
    });
  };
  
  const handleRecommendationStatusChange = (recommendationId: number) => {
    setRecommendations(prevRecs => 
      prevRecs.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, status: 'done' }
          : rec
      )
    );
    
    toast({
      title: "Melhoria marcada como concluída",
      description: "A recomendação foi marcada como concluída com sucesso.",
    });
  };
  
  const handleGenerateReport = async () => {
    if (!client || !client.website) {
      toast({
        title: "Erro",
        description: "Cliente sem website definido.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Relatório em geração",
        description: "O novo relatório está sendo gerado e ficará disponível em breve.",
      });
      
      const result = await getFullAnalysis(client.website);
      
      const updatedClient = {
        ...client,
        lastReport: new Date().toISOString().split('T')[0],
        seoScore: result.seo.score,
        aioScore: result.aio.score,
        lastAnalysis: new Date(),
        status: 'active' as const
      };
      
      await updateClientInDatabase(updatedClient);
      
      await saveAnalysisResult(client.id, result);
      
      setClient(updatedClient);
      
      setHistoricalData(prev => [
        ...prev, 
        {
          date: new Date().toISOString().split('T')[0],
          seoScore: result.seo.score,
          aioScore: result.aio.score
        }
      ]);
      
      setRecommendations(result.recommendations || []);
      
      toast({
        title: "Análise concluída",
        description: "O relatório foi gerado com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendUpdate = () => {
    toast({
      title: "Atualização enviada",
      description: "A atualização foi enviada ao cliente com sucesso.",
    });
  };
  
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'Alto':
        return <Badge className="bg-red-500">{impact}</Badge>;
      case 'Médio':
        return <Badge className="bg-amber-500">{impact}</Badge>;
      case 'Baixo':
        return <Badge variant="outline">{impact}</Badge>;
      default:
        return <Badge variant="secondary">{impact}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Carregando dados do cliente...</h2>
            <p className="text-muted-foreground">Por favor, aguarde enquanto buscamos as informações.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
            <p className="text-muted-foreground">O cliente solicitado não existe ou foi removido.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const currentSEOScore = client.seoScore || 0;
  const currentAIOScore = client.aioScore || 0;
  
  let seoDiff = 0;
  let aioDiff = 0;
  
  if (historicalData.length >= 2) {
    const currentData = historicalData[historicalData.length - 1];
    const previousData = historicalData[historicalData.length - 2];
    seoDiff = currentData.seoScore - previousData.seoScore;
    aioDiff = currentData.aioScore - previousData.aioScore;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Cliente</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <h1 className="text-xl md:text-3xl font-bold truncate">{client.name}</h1>
            </div>
            <p className="text-muted-foreground mt-1 text-sm md:text-base truncate">{client.website}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button onClick={handleGenerateReport} size={isMobile ? "sm" : "default"}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isMobile ? "Novo relatório" : "Gerar novo relatório"}
            </Button>
            <Button variant="outline" onClick={handleSendUpdate} size={isMobile ? "sm" : "default"}>
              <Mail className="mr-2 h-4 w-4" />
              {isMobile ? "Atualizar" : "Enviar atualização"}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className={isMobile ? "px-4 py-3" : ""}>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "px-4 py-2" : ""}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Nome de Contato</h3>
                  <p className="text-sm md:text-base">{client.contactName || 'Não definido'}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-sm md:text-base break-all">{client.contactEmail || 'Não definido'}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Telefone</h3>
                  <p className="text-sm md:text-base">{'Não definido'}</p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Account Manager</h3>
                  <p className="text-sm md:text-base">{client.account || 'Não definido'}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Cliente desde</h3>
                  <p className="text-sm md:text-base">{client.lastAnalysis ? new Date(client.lastAnalysis).toISOString().split('T')[0] : 'Não definido'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <Card>
            <CardHeader className={isMobile ? "px-4 py-3 pb-1" : "pb-2"}>
              <CardTitle className={isMobile ? "text-base" : ""}>SEO Score</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "px-4 pt-0" : "pt-0"}>
              <div className="flex items-end gap-2">
                <div className={`${isMobile ? "text-3xl" : "text-4xl"} font-bold`}>
                  {currentSEOScore}
                </div>
                {seoDiff !== 0 && (
                  <div className={`flex items-center ${seoDiff >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium pb-1`}>
                    {seoDiff >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(seoDiff)} pts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={isMobile ? "px-4 py-3 pb-1" : "pb-2"}>
              <CardTitle className={isMobile ? "text-base" : ""}>AIO Score</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "px-4 pt-0" : "pt-0"}>
              <div className="flex items-end gap-2">
                <div className={`${isMobile ? "text-3xl" : "text-4xl"} font-bold`}>
                  {currentAIOScore}
                </div>
                {aioDiff !== 0 && (
                  <div className={`flex items-center ${aioDiff >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium pb-1`}>
                    {aioDiff >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(aioDiff)} pts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className={isMobile ? "px-4 py-3" : ""}>
            <CardTitle>Evolução Histórica</CardTitle>
            <CardDescription>
              Progresso dos scores SEO e AIO ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "px-2 py-2" : ""}>
            {historicalData.length === 0 ? (
              <div className="text-center py-8 md:py-12 text-muted-foreground">
                <p>Ainda não há dados históricos disponíveis.</p>
                <p className="mt-2">Gere um novo relatório para começar a acompanhar o progresso.</p>
              </div>
            ) : (
              <div className="h-64 md:h-80">
                <ChartContainer config={{
                  seo: { label: "SEO Score", theme: { light: "#0EA5E9", dark: "#3b82f6" } },
                  aio: { label: "AIO Score", theme: { light: "#9333ea", dark: "#a855f7" } },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={isMobile ? { top: 5, right: 5, left: -20, bottom: 5 } : {}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        tick={isMobile ? {fontSize: 10} : undefined}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        domain={[0, 100]}
                        tick={isMobile ? {fontSize: 10} : undefined}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="seoScore"
                        name="SEO Score"
                        stroke="var(--color-seo)"
                        strokeWidth={2}
                        dot={{ r: isMobile ? 3 : 5 }}
                        activeDot={{ r: isMobile ? 6 : 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="aioScore"
                        name="AIO Score"
                        stroke="var(--color-aio)"
                        strokeWidth={2}
                        dot={{ r: isMobile ? 3 : 5 }}
                        activeDot={{ r: isMobile ? 6 : 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="recommendations">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="mt-4">
            <Card>
              <CardHeader className={isMobile ? "px-4 py-3" : ""}>
                <CardTitle>Recomendações específicas</CardTitle>
                <CardDescription>
                  Lista de melhorias recomendadas para o site
                </CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-2 py-2" : ""}>
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-muted-foreground">
                    <p>Ainda não há recomendações disponíveis.</p>
                    <p className="mt-2">Gere um novo relatório para receber recomendações de melhoria.</p>
                  </div>
                ) : (
                  <div className={`overflow-x-auto ${isMobile ? "-mx-2" : ""}`}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={`${isMobile ? "w-[250px]" : "w-[400px]"}`}>Descrição</TableHead>
                          <TableHead>Impacto SEO</TableHead>
                          <TableHead>Impacto AIO</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Marcar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recommendations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className={`font-medium ${isMobile ? "text-sm" : ""}`}>
                              {item.suggestion || item.description}
                            </TableCell>
                            <TableCell>{getImpactBadge(item.seoImpact)}</TableCell>
                            <TableCell>{getImpactBadge(item.aioImpact)}</TableCell>
                            <TableCell>
                              {item.status === 'done' ? (
                                <Badge className="bg-green-500">Concluída</Badge>
                              ) : (
                                <Badge variant="outline">Pendente</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.status !== 'done' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRecommendationStatusChange(item.id)}
                                >
                                  <FileCheck className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader className={isMobile ? "px-4 py-3" : ""}>
                <CardTitle>Tarefas</CardTitle>
                <CardDescription>
                  Tarefas geradas automaticamente para o account
                </CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-4 py-2" : ""}>
                {tasks.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-muted-foreground">
                    <p>Ainda não há tarefas definidas.</p>
                    <p className="mt-2">As tarefas serão geradas com base nas recomendações.</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center justify-between p-3 md:p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id={`task-${task.id}`}
                            checked={task.status === 'done'}
                            onCheckedChange={() => handleTaskStatusChange(task.id)}
                          />
                          <div>
                            <label 
                              htmlFor={`task-${task.id}`}
                              className={`font-medium cursor-pointer ${isMobile ? "text-sm" : ""}`}
                            >
                              {task.description}
                            </label>
                            <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                              Data limite: {task.dueDate}
                            </p>
                          </div>
                        </div>
                        {task.status === 'pending' && (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                        {task.status === 'done' && (
                          <Badge className="bg-green-500">Concluída</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const isMobile = useIsMobile();
  
  if (active && payload && payload.length) {
    return (
      <ChartTooltipContent>
        <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{label}</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>SEO Score</div>
            <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{payload[0].value}</div>
          </div>
          <div>
            <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>AIO Score</div>
            <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{payload[1].value}</div>
          </div>
        </div>
      </ChartTooltipContent>
    );
  }
  return null;
};

export default ClientPage;

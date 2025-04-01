
import React from 'react';
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

// Mock client data
const clientData = {
  id: 1,
  name: 'Tech Solutions',
  website: 'techsolutions.pt',
  contactName: 'João Pereira',
  email: 'joao@techsolutions.pt',
  phone: '912345678',
  account: 'João Silva',
  createdAt: '2023-09-01',
};

// Mock historical data for charts
const historicalData = [
  { date: '2023-09-01', seoScore: 65, aioScore: 60 },
  { date: '2023-09-15', seoScore: 68, aioScore: 63 },
  { date: '2023-10-01', seoScore: 75, aioScore: 68 },
  { date: '2023-10-15', seoScore: 87, aioScore: 72 },
];

// Mock recommendations
const recommendations = [
  {
    id: 1,
    description: 'Adicionar meta description única para todas as páginas importantes',
    impact: { seo: 'Alto', aio: 'Médio' },
    type: ['SEO', 'AIO'],
    status: 'pending',
  },
  {
    id: 2,
    description: 'Otimizar tamanho das imagens para melhorar tempo de carregamento',
    impact: { seo: 'Alto', aio: 'Baixo' },
    type: ['SEO'],
    status: 'pending',
  },
  {
    id: 3,
    description: 'Melhorar estrutura de headings para facilitar compreensão por IA',
    impact: { seo: 'Médio', aio: 'Alto' },
    type: ['AIO'],
    status: 'done',
  },
  {
    id: 4,
    description: 'Implementar schema markup para produtos e serviços',
    impact: { seo: 'Alto', aio: 'Alto' },
    type: ['SEO', 'AIO'],
    status: 'pending',
  },
];

// Mock tasks
const tasks = [
  {
    id: 1,
    description: 'Enviar relatório mensal de SEO',
    dueDate: '2023-10-20',
    status: 'pending',
  },
  {
    id: 2,
    description: 'Implementar recomendações de otimização de imagens',
    dueDate: '2023-10-25',
    status: 'pending',
  },
  {
    id: 3,
    description: 'Revisar e atualizar meta descriptions',
    dueDate: '2023-10-30',
    status: 'pending',
  },
];

// Chart configuration
const chartConfig = {
  seo: { label: "SEO Score", theme: { light: "#2563eb", dark: "#3b82f6" } },
  aio: { label: "AIO Score", theme: { light: "#9333ea", dark: "#a855f7" } },
};

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Function to handle task status change
  const handleTaskStatusChange = (taskId: number) => {
    toast({
      title: "Tarefa atualizada",
      description: "O status da tarefa foi alterado com sucesso.",
    });
  };
  
  // Function to handle recommendation status change
  const handleRecommendationStatusChange = (recommendationId: number) => {
    toast({
      title: "Melhoria marcada como concluída",
      description: "A recomendação foi marcada como concluída com sucesso.",
    });
  };
  
  // Function to handle report generation
  const handleGenerateReport = () => {
    toast({
      title: "Relatório em geração",
      description: "O novo relatório está sendo gerado e ficará disponível em breve.",
    });
  };
  
  // Function to handle sending update
  const handleSendUpdate = () => {
    toast({
      title: "Atualização enviada",
      description: "A atualização foi enviada ao cliente com sucesso.",
    });
  };
  
  // Determine impact badge color
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
  
  // Calculate current scores
  const currentSEOScore = historicalData[historicalData.length - 1].seoScore;
  const currentAIOScore = historicalData[historicalData.length - 1].aioScore;
  const previousSEOScore = historicalData[historicalData.length - 2].seoScore;
  const previousAIOScore = historicalData[historicalData.length - 2].aioScore;
  
  // Calculate difference from previous scores
  const seoDiff = currentSEOScore - previousSEOScore;
  const aioDiff = currentAIOScore - previousAIOScore;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Cliente</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <h1 className="text-3xl font-bold">{clientData.name}</h1>
            </div>
            <p className="text-muted-foreground mt-1">{clientData.website}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateReport}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar novo relatório
            </Button>
            <Button variant="outline" onClick={handleSendUpdate}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar atualização
            </Button>
          </div>
        </div>
        
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nome de Contato</h3>
                  <p>{clientData.contactName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{clientData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                  <p>{clientData.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Manager</h3>
                  <p>{clientData.account}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cliente desde</h3>
                  <p>{clientData.createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold">
                  {currentSEOScore}
                </div>
                <div className={`flex items-center ${seoDiff >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium pb-1`}>
                  {seoDiff >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(seoDiff)} pts
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>AIO Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold">
                  {currentAIOScore}
                </div>
                <div className={`flex items-center ${aioDiff >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium pb-1`}>
                  {aioDiff >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(aioDiff)} pts
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Historical Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Histórica</CardTitle>
            <CardDescription>
              Progresso dos scores SEO e AIO ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="seoScore"
                      name="SEO Score"
                      stroke="var(--color-seo)"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aioScore"
                      name="AIO Score"
                      stroke="var(--color-aio)"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendations & Tasks Tabs */}
        <Tabs defaultValue="recommendations">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recomendações específicas</CardTitle>
                <CardDescription>
                  Lista de melhorias recomendadas para o site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Impacto SEO</TableHead>
                      <TableHead>Impacto AIO</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Marcar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.type.map(type => (
                              <Badge key={type} variant="outline">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getImpactBadge(item.impact.seo)}</TableCell>
                        <TableCell>{getImpactBadge(item.impact.aio)}</TableCell>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tarefas</CardTitle>
                <CardDescription>
                  Tarefas geradas automaticamente para o account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
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
                            className="font-medium cursor-pointer"
                          >
                            {task.description}
                          </label>
                          <p className="text-sm text-muted-foreground">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipContent>
        <div className="text-sm font-medium">{label}</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <div className="text-xs text-muted-foreground">SEO Score</div>
            <div className="text-sm font-medium">{payload[0].value}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">AIO Score</div>
            <div className="text-sm font-medium">{payload[1].value}</div>
          </div>
        </div>
      </ChartTooltipContent>
    );
  }
  return null;
};

export default ClientPage;

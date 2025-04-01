
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  BarChart
} from 'lucide-react';
import { Client, processBulkImport, analyzeBulkClients } from '@/utils/apiServices';

const BulkImportPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importedClients, setImportedClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo CSV para importar.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const clients = await processBulkImport(selectedFile);
      setImportedClients(clients);
      
      toast({
        title: "Importação concluída",
        description: `${clients.length} clientes importados com sucesso.`,
      });
      
    } catch (error) {
      console.error("Error importing clients:", error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedClients.length === importedClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(importedClients.map(client => client.id));
    }
  };

  const handleSelectClient = (id: number) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(clientId => clientId !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const handleAnalyzeSelected = async () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Nenhum cliente selecionado",
        description: "Selecione pelo menos um cliente para analisar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeBulkClients(selectedClients);
      
      toast({
        title: "Análise concluída",
        description: `${selectedClients.length} clientes analisados com sucesso.`,
      });
      
      // Redirect to clients page after analysis
      navigate("/dashboard/clients");
      
    } catch (error) {
      console.error("Error analyzing clients:", error);
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao analisar os clientes.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = 'name,website,contactName,contactEmail\nEmpresa Exemplo,https://exemplo.com,João Silva,joao@exemplo.com\nTech Solutions,https://techsol.pt,Maria Oliveira,maria@techsol.pt';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clientes_modelo.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Importação em Massa</h1>
          <p className="text-muted-foreground mt-1">
            Importe vários clientes de uma vez e analise seus websites
          </p>
        </div>

        <Tabs defaultValue="import">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="import">Importar Clientes</TabsTrigger>
            <TabsTrigger value="analyze">Analisar Websites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Importar Clientes</CardTitle>
                <CardDescription>
                  Carregue um arquivo CSV com informações dos clientes para importar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Button 
                    variant="outline" 
                    onClick={downloadSampleCsv}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Baixar modelo CSV
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    O arquivo CSV deve conter as colunas: name, website, contactName, contactEmail
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="max-w-sm"
                  />
                  <Button
                    onClick={handleImport}
                    disabled={!selectedFile || isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Importando..." : "Importar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {importedClients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Importados</CardTitle>
                  <CardDescription>
                    {importedClients.length} clientes importados com sucesso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input 
                            type="checkbox" 
                            checked={selectedClients.length === importedClients.length}
                            onChange={handleSelectAll} 
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importedClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.website}</TableCell>
                          <TableCell>
                            <div>
                              <div>{client.contactName}</div>
                              <div className="text-sm text-muted-foreground">{client.contactEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-amber-500">Pendente</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAnalyzeSelected()} 
                    disabled={selectedClients.length === 0 || isAnalyzing}
                    className="flex items-center gap-2"
                  >
                    <BarChart className="h-4 w-4" />
                    {isAnalyzing ? "Analisando..." : `Analisar ${selectedClients.length} Clientes Selecionados`}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="analyze">
            <Card>
              <CardHeader>
                <CardTitle>Análise em Massa</CardTitle>
                <CardDescription>
                  Analise simultaneamente vários websites de clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Análise automatizada de SEO com Google Page Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Análise de conteúdo com ChatGPT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Pontuações e recomendações personalizadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Certifique-se de que configurou as APIs nas configurações</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => navigate('/dashboard/clients')}
                  className="flex items-center gap-2"
                >
                  Ir para a página de Clientes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BulkImportPage;

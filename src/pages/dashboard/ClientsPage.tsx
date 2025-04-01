
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, PlusCircle, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/utils/api/types';
import { getClientsFromDatabase } from '@/utils/api/supabaseClient';
import { toast } from 'sonner';

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const clientsData = await getClientsFromDatabase();
        console.log('Fetched clients:', clientsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Erro ao buscar clientes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle client view
  const handleViewClient = (clientId: number) => {
    navigate(`/dashboard/client/${clientId}`);
  };
  
  // Handle client edit
  const handleEditClient = (clientId: number) => {
    uiToast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de clientes será implementada em breve.",
    });
  };
  
  // Handle client delete
  const handleDeleteClient = (clientId: number) => {
    uiToast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de clientes será implementada em breve.",
    });
  };
  
  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus clientes e acesse seus relatórios</p>
          </div>
          
          <Button onClick={() => {
            uiToast({
              title: "Funcionalidade em desenvolvimento",
              description: "A adição de clientes será implementada em breve.",
            });
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar clientes..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Clients Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score SEO</TableHead>
                <TableHead>Score AIO</TableHead>
                <TableHead>Última Análise</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Carregando clientes...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.website}</TableCell>
                    <TableCell>
                      <div>
                        <div>{client.contactName}</div>
                        <div className="text-sm text-muted-foreground">{client.contactEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{client.account}</TableCell>
                    <TableCell>{getStatusBadge(client.status || 'active')}</TableCell>
                    <TableCell>{client.seoScore}</TableCell>
                    <TableCell>{client.aioScore}</TableCell>
                    <TableCell>{client.lastAnalysis ? new Date(client.lastAnalysis).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewClient(client.id as number)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClient(client.id as number)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClient(client.id as number)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;

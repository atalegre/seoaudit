
import React, { useState } from 'react';
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
import { MoreHorizontal, Search, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for clients
const clients = [
  {
    id: 1,
    name: 'Tech Solutions',
    website: 'techsolutions.pt',
    contactEmail: 'joao@techsolutions.pt',
    contactName: 'João Pereira',
    account: 'João Silva',
    status: 'active',
    lastReport: '2023-10-15',
    seoScore: 87,
    aioScore: 72,
  },
  {
    id: 2,
    name: 'Design Masters',
    website: 'designmasters.pt',
    contactEmail: 'ana@designmasters.pt',
    contactName: 'Ana Santos',
    account: 'Maria Oliveira',
    status: 'active',
    lastReport: '2023-10-10',
    seoScore: 92,
    aioScore: 85,
  },
  {
    id: 3,
    name: 'Café Lisboa',
    website: 'cafelisboa.pt',
    contactEmail: 'pedro@cafelisboa.pt',
    contactName: 'Pedro Costa',
    account: 'João Silva',
    status: 'inactive',
    lastReport: '2023-09-20',
    seoScore: 65,
    aioScore: 58,
  },
  {
    id: 4,
    name: 'Auto Parts',
    website: 'autoparts.pt',
    contactEmail: 'carlos@autoparts.pt',
    contactName: 'Carlos Mendes',
    account: 'Maria Oliveira',
    status: 'pending',
    lastReport: '2023-10-01',
    seoScore: 73,
    aioScore: 67,
  },
  {
    id: 5,
    name: 'Escola de Música',
    website: 'escolamusica.pt',
    contactEmail: 'sofia@escolamusica.pt',
    contactName: 'Sofia Almeida',
    account: 'João Silva',
    status: 'active',
    lastReport: '2023-10-12',
    seoScore: 81,
    aioScore: 75,
  },
];

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle client view
  const handleViewClient = (clientId: number) => {
    navigate(`/dashboard/client/${clientId}`);
  };
  
  // Handle client edit
  const handleEditClient = (clientId: number) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de clientes será implementada em breve.",
    });
  };
  
  // Handle client delete
  const handleDeleteClient = (clientId: number) => {
    toast({
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
            toast({
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
                <TableHead>Último Relatório</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
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
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>{client.seoScore}</TableCell>
                    <TableCell>{client.aioScore}</TableCell>
                    <TableCell>{client.lastReport}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewClient(client.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClient(client.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClient(client.id)}
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

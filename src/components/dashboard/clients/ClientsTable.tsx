
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/utils/api/types';
import ClientsTableRow from './ClientsTableRow';

interface ClientsTableProps {
  clients: Client[];
  filteredClients: Client[];
  isLoading: boolean;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ 
  clients, 
  filteredClients, 
  isLoading 
}) => {
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
              <ClientsTableRow 
                key={client.id} 
                client={client} 
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;

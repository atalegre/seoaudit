
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/utils/api/types';
import ClientActionsMenu from './ClientActionsMenu';

interface ClientsTableRowProps {
  client: Client;
  getStatusBadge: (status: string) => React.ReactNode;
}

const ClientsTableRow: React.FC<ClientsTableRowProps> = ({ 
  client,
  getStatusBadge
}) => {
  return (
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
        <ClientActionsMenu clientId={client.id as number} />
      </TableCell>
    </TableRow>
  );
};

export default ClientsTableRow;

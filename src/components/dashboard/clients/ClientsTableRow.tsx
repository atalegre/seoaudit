
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Client } from '@/utils/api/types';
import ClientActionsMenu from './ClientActionsMenu';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClientsTableRowProps {
  client: Client;
  getStatusBadge: (status: string) => React.ReactNode;
}

const ClientsTableRow: React.FC<ClientsTableRowProps> = ({ 
  client,
  getStatusBadge
}) => {
  const { t, language } = useLanguage();
  
  // Format the date according to the current language
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return t('never');
    
    try {
      const date = new Date(dateString);
      return language === 'pt' 
        ? date.toLocaleDateString('pt-BR')
        : date.toLocaleDateString('en-US');
    } catch (error) {
      console.error('Error formatting date:', error);
      return t('never');
    }
  };
  
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
      <TableCell>{getStatusBadge(client.status || t('active'))}</TableCell>
      <TableCell>{client.seoScore}</TableCell>
      <TableCell>{client.aioScore}</TableCell>
      <TableCell>{formatDate(client.lastAnalysis)}</TableCell>
      <TableCell>
        <ClientActionsMenu clientId={client.id as number} />
      </TableCell>
    </TableRow>
  );
};

export default ClientsTableRow;


import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Client } from '@/utils/api/types';
import ClientActionsMenu from './ClientActionsMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate as globalFormatDate } from '@/utils/formatUtils';

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
  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return t('never');
    
    try {
      // Convert the date parameter to a Date object if it's a string
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return t('never');
      }
      
      // Format based on language
      return language === 'pt' 
        ? dateObj.toLocaleDateString('pt-BR')
        : dateObj.toLocaleDateString('en-US');
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

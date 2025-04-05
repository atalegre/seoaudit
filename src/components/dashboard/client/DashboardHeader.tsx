
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';

export interface DashboardHeaderProps {
  clientName: string;
  clientWebsite: string;
  clientStatus?: string;
  clientLastUpdate: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  clientName,
  clientWebsite,
  clientStatus = 'active',
  clientLastUpdate
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
      case 'crítico':
        return <Badge variant="destructive">{status}</Badge>;
      case 'improved':
      case 'melhorou':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'healthy':
      case 'saudável':
        return <Badge className="bg-green-700">{status}</Badge>;
      case 'active':
      case 'ativo':
        return <Badge className="bg-blue-500">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{clientName}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
          <a 
            href={clientWebsite.startsWith('http') ? clientWebsite : `https://${clientWebsite}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            {clientWebsite}
          </a>
          {clientStatus && getStatusBadge(clientStatus)}
        </div>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0 text-sm text-muted-foreground">
        <CalendarDays className="mr-2 h-4 w-4" />
        <span>Última atualização: {
          clientLastUpdate === 'Never' 
            ? 'Nunca' 
            : new Date(clientLastUpdate).toLocaleDateString('pt-BR')
        }</span>
      </div>
    </div>
  );
};

export default DashboardHeader;

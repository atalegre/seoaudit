
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatDate } from '@/utils/formatUtils';

export interface WebsiteCardProps {
  url: string;
  status?: string;
  lastAnalyzed?: string | Date | null;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ 
  url, 
  status = 'Ativo', 
  lastAnalyzed 
}) => {
  const formattedDate = formatDate(lastAnalyzed);
  
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div>
        <h3 className="font-medium">{url}</h3>
        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
          <span>Status: {status}</span>
          <span>Última análise: {formattedDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <ExternalLink size={14} />
          Visitar
        </Button>
        <Button variant="outline" size="sm">Analisar</Button>
      </div>
    </div>
  );
};

export default WebsiteCard;

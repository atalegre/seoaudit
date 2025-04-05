
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WebsiteCardProps {
  url: string;
  status?: string;
  lastAnalyzed?: string | Date;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ url, status = 'Ativo', lastAnalyzed }) => {
  // Format date properly, handling both string and Date objects
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'Nunca';
    
    try {
      // Handle both string and Date objects
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Data inválida';
    }
  };

  // Extract domain for display
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium truncate mr-2">{displayUrl}</h3>
              <a
                href={url.startsWith('http') ? url : `https://${url}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-500 hover:text-gray-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Visitar website</span>
              </a>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <div className="mr-3 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  status === 'active' || status === 'Ativo' || status === 'Saudável' 
                    ? 'bg-green-500' 
                    : status === 'pending' || status === 'Pendente' 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-400'
                }`} />
                <span>{status}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Última análise: {formatDate(lastAnalyzed)}</span>
              </div>
            </div>
          </div>
          
          <Link 
            to={`/dashboard/client?url=${encodeURIComponent(url)}`}
            className="text-sm text-primary hover:text-primary/90 hover:underline ml-4"
          >
            Ver detalhes
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteCard;

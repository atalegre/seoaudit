
import React from 'react';

interface WebsitesStateDisplayProps {
  isLoading: boolean;
  isEmpty: boolean;
}

const WebsitesStateDisplay: React.FC<WebsitesStateDisplayProps> = ({ 
  isLoading, 
  isEmpty 
}) => {
  if (isLoading) {
    return <p className="text-muted-foreground">Carregando websites...</p>;
  }
  
  if (isEmpty) {
    return <p className="text-muted-foreground">Nenhum website adicionado.</p>;
  }
  
  return null;
};

export default WebsitesStateDisplay;


import React from 'react';
import { DirectoryPresenceResult } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Info, Link, AlertCircle, X } from 'lucide-react';

interface FoundPresenceProps {
  presence: DirectoryPresenceResult;
}

export const FoundPresence: React.FC<FoundPresenceProps> = ({ presence }) => {
  const renderStatusIcon = (status?: boolean) => {
    if (status === undefined) return null;
    
    return status ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <AlertCircle className="h-4 w-4 text-amber-500" />;
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Badge className="bg-green-500">
          <Check className="h-3 w-3 mr-1" /> Empresa encontrada
        </Badge>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🔹 Nome:</span>
          <span className="font-medium">{presence.name}</span>
          {renderStatusIcon(presence.nameMatch)}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🔹 Telefone:</span>
          <span className="font-medium">{presence.phone}</span>
          {renderStatusIcon(presence.phoneMatch)}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🔹 URL:</span>
          <span className="font-medium">{presence.url}</span>
          {renderStatusIcon(presence.urlMatch)}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={() => window.open(presence.paiUrl, '_blank')}
      >
        <Link className="h-3 w-3 mr-1" /> Ver ficha no PAI.pt
      </Button>
      
      <Alert className="mt-4 bg-green-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          A sua empresa está listada corretamente no PAI.pt – ótimo para SEO local e confiança.
        </AlertDescription>
      </Alert>
    </>
  );
};

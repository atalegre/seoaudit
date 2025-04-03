
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, X } from 'lucide-react';

export const NotFoundPresence: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="destructive">
          <X className="h-3 w-3 mr-1" /> Empresa não encontrada
        </Badge>
      </div>
      
      <Alert className="bg-amber-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          A sua empresa não foi encontrada no PAI.pt. Recomendamos que a adicione para melhorar visibilidade local e confiança digital.
        </AlertDescription>
      </Alert>
    </>
  );
};

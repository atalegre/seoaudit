
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PartialDataAlertProps {
  seoError: string | null;
  aioError: string | null;
  seoHasError: boolean;
  seoErrorMessage?: string;
}

const PartialDataAlert: React.FC<PartialDataAlertProps> = ({ 
  seoError, 
  aioError, 
  seoHasError,
  seoErrorMessage 
}) => {
  if (!seoError && !aioError && !seoHasError) return null;
  
  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Dados parciais disponíveis</AlertTitle>
      <AlertDescription className="space-y-2">
        {seoError && <p><strong>Análise SEO:</strong> {seoError}</p>}
        {seoHasError && <p><strong>Análise SEO:</strong> {seoErrorMessage || "Erro ao obter dados SEO"}</p>}
        {aioError && <p><strong>Análise AIO:</strong> {aioError}</p>}
        <p>Os resultados mostrados são baseados apenas nos dados que pudemos obter.</p>
      </AlertDescription>
    </Alert>
  );
};

export default PartialDataAlert;

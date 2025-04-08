
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center space-y-4">
      <div className="p-3 bg-red-50 rounded-full">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <div className="text-center">
        <h3 className="font-medium mb-1">Erro na análise</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ocorreu um problema ao analisar a presença da marca. Por favor, tente novamente.
        </p>
        <Button onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;

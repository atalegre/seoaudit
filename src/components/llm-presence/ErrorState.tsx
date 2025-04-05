
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <AlertTriangle className="h-10 w-10 text-amber-500" />
      <p className="text-center text-muted-foreground">Não foi possível analisar a presença em LLMs para este domínio.</p>
      <Button onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
};

export default ErrorState;

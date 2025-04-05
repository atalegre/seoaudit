
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ScoreAlert: React.FC = () => {
  return (
    <div className="bg-muted/50 p-4 rounded-md mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div>
          <h4 className="font-medium mb-1">Visibilidade limitada em LLMs</h4>
          <p className="text-sm text-muted-foreground">
            Seu domínio tem visibilidade limitada em modelos de linguagem grandes. 
            Veja o relatório completo para recomendações.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreAlert;

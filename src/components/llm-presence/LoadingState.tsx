
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-center text-muted-foreground">
        Analisando a presença da marca em modelos de IA...
        <br />
        <span className="text-sm">Isto pode demorar alguns segundos.</span>
      </p>
    </div>
  );
};

export default LoadingState;

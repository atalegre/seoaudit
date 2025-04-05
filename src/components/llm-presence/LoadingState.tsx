
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-aio" />
        <p className="text-muted-foreground">Analisando presença em LLMs...</p>
      </div>
    </div>
  );
};

export default LoadingState;

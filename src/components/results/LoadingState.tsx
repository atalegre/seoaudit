
import React from 'react';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">A analisar o seu site...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;

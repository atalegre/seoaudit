
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LazyLoadingFallback: React.FC = () => (
  <div className="flex justify-center items-center h-32 w-full">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

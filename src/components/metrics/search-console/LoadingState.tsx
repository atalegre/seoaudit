
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoadingState: React.FC = () => {
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Search Console</CardTitle>
        <CardDescription>Carregando dados de tráfego...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;

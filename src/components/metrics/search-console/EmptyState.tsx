
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Search Console</CardTitle>
        <CardDescription>Configure o Google Search Console para ver os dados de tráfego</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gray-50 text-gray-600 rounded-md">
          Para visualizar os dados de tráfego, configure a integração com o Google Search Console
          nas configurações do sistema.
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Search Console</CardTitle>
        <CardDescription>Erro ao carregar dados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface SearchConsoleDisplayProps {
  clientId: number;
}

const SearchConsoleDisplay: React.FC<SearchConsoleDisplayProps> = ({ clientId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Search Console</CardTitle>
        <CardDescription>
          Visualize dados do Google Search Console para seus websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não conectado</AlertTitle>
          <AlertDescription>
            Você precisa configurar a autenticação do Google para visualizar os dados do Search Console.
            Configure isso na aba Visão Geral.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SearchConsoleDisplay;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getApiKey } from '@/utils/api/supabaseClient';

export interface SearchConsoleDisplayProps {
  clientId: number;
}

const SearchConsoleDisplay: React.FC<SearchConsoleDisplayProps> = ({ clientId }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setIsLoading(true);
        // Get user email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        
        if (userEmail) {
          const apiKeyData = await getApiKey(userEmail);
          setIsConfigured(!!apiKeyData?.apiKey);
        } else {
          setIsConfigured(false);
        }
      } catch (error) {
        console.error('Error checking API key:', error);
        setIsConfigured(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApiKey();
  }, [clientId]);

  const handleSetupGoogle = () => {
    window.location.href = '/dashboard/settings';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Search Console</CardTitle>
          <CardDescription>
            Visualize dados do Google Search Console para seus websites
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Verificando configuração...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Search Console</CardTitle>
        <CardDescription>
          Visualize dados do Google Search Console para seus websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConfigured ? (
          <>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Não conectado</AlertTitle>
              <AlertDescription>
                Você precisa configurar a autenticação do Google para visualizar os dados do Search Console.
              </AlertDescription>
            </Alert>
            <Button onClick={handleSetupGoogle}>Configurar Google API</Button>
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Dados do Search Console serão exibidos aqui após a primeira análise.
            </p>
            <Button variant="outline">Atualizar dados</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchConsoleDisplay;

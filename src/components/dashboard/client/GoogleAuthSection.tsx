
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiKey } from '@/utils/api/supabaseClient';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GoogleAuthSectionProps {
  clientId: number;
}

const GoogleAuthSection: React.FC<GoogleAuthSectionProps> = ({ clientId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      try {
        setIsLoading(true);
        // Get the user email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.warn('User email not found in localStorage');
          setIsConnected(false);
          return;
        }
        
        // Check if the API key exists
        const apiData = await getApiKey(userEmail);
        setIsConnected(!!apiData?.apiKey);
      } catch (error) {
        console.error('Error checking API key status:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApiKeyStatus();
  }, [clientId]);
  
  const handleConnectGoogle = () => {
    // Redirect to settings page for API key configuration
    window.location.href = '/dashboard/settings';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Integração com Google</CardTitle>
        <CardDescription>
          Conecte sua conta Google para acessar dados do Search Console e Analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <span>Verificando status da conexão...</span>
          </div>
        ) : isConnected ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Conectado ao Google</AlertTitle>
            <AlertDescription className="text-green-700">
              Sua conta Google está conectada e pronta para uso.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Não conectado</AlertTitle>
              <AlertDescription>
                Você precisa conectar sua conta Google para acessar dados adicionais.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleConnectGoogle}>
              Conectar Google
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAuthSection;

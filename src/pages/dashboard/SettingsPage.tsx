
import React, { useContext, useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storeApiKey, getApiKey } from '@/utils/api';
import { toast } from 'sonner';
import { UserContext } from '@/contexts/UserContext';

const SettingsPage = () => {
  const userContext = useContext(UserContext);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadApiKeys = async () => {
      setIsLoading(true);
      try {
        // Make sure to check if user email exists before trying to use it
        const email = userContext?.user?.email;
        if (!email) {
          console.warn('User email not available');
          return;
        }
        
        const googleKeyData = await getApiKey(email);
        if (googleKeyData && googleKeyData.apiKey) {
          setGoogleApiKey(googleKeyData.apiKey);
        }
        
        // Load other API keys here
        
      } catch (error) {
        console.error('Error loading API keys:', error);
        toast.error('Erro ao carregar as chaves API');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApiKeys();
  }, [userContext?.user?.email]);
  
  const handleSaveApiKeys = async () => {
    setIsSaving(true);
    try {
      // Check if user email exists
      const email = userContext?.user?.email;
      if (!email) {
        toast.error('Você precisa estar logado para salvar as configurações');
        return;
      }
      
      // Save Google API key
      await storeApiKey(email, googleApiKey);
      
      // Save other API keys here
      
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Erro ao salvar as configurações');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Configure suas integrações e preferências
          </p>
        </div>
        
        <Tabs defaultValue="api">
          <TabsList>
            <TabsTrigger value="api">Chaves API</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google API</CardTitle>
                <CardDescription>
                  Configure sua chave de API do Google para acessar recursos como Search Console e Google Analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chave de API</label>
                  <Input
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="Insira sua chave de API do Google"
                    type="password"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Obtenha sua chave em <a href="https://console.cloud.google.com/apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Google Cloud Console</a>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>OpenAI API</CardTitle>
                <CardDescription>
                  Configure sua chave de API do OpenAI para usar recursos avançados de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chave de API</label>
                  <Input
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="Insira sua chave de API do OpenAI"
                    type="password"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Obtenha sua chave em <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">OpenAI API</a>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveApiKeys} disabled={isSaving || isLoading}>
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configurações de notificações serão implementadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências Gerais</CardTitle>
                <CardDescription>
                  Configure suas preferências de uso do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Preferências gerais serão implementadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

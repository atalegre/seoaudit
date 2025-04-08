
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserManagement from '@/components/dashboard/UserManagement';

const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Configurações</h1>
      <p className="text-muted-foreground mb-6">
        Configure suas integrações e preferências
      </p>
      
      <Tabs defaultValue="api-keys">
        <TabsList className="mb-6">
          <TabsTrigger value="api-keys">Chaves API</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google API</CardTitle>
                <CardDescription>
                  Configure sua chave de API do Google para acessar recursos como Search Console e Google Analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chave de API</label>
                    <Input type="password" placeholder="Insira sua chave de API do Google" />
                  </div>
                  <div className="flex items-center">
                    <a 
                      href="https://console.cloud.google.com/apis/credentials" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mr-auto"
                    >
                      Obtenha sua chave em Google Cloud Console
                    </a>
                    <Button>Salvar</Button>
                  </div>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chave de API</label>
                    <Input type="password" placeholder="Insira sua chave de API do OpenAI" />
                  </div>
                  <div className="flex items-center">
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mr-auto"
                    >
                      Obtenha sua chave em OpenAI API
                    </a>
                    <Button>Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Escolha quais notificações você deseja receber
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta funcionalidade estará disponível em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Personalize a aparência e o comportamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta funcionalidade estará disponível em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

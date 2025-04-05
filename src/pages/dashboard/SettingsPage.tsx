import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getApiKey, storeApiKey } from '@/utils/api/supabaseClient';
import { CookieSettings, CONSENT_KEY } from '@/utils/cookie-consent/types';
import { CookieConsentTracking } from '@/utils/cookie-consent/tracking';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userEmail } = useUser();
  
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  
  const [apiKeys, setApiKeys] = useState({
    google: '',
    facebook: '',
    bing: '',
    searchConsole: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Load cookie settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(CONSENT_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as CookieSettings;
        setCookieSettings(parsedSettings);
      } catch (e) {
        console.error('Error parsing cookie settings:', e);
      }
    }
  }, []);
  
  // Load API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      if (!userEmail) return;
      
      setIsLoading(true);
      try {
        const apiKeys = {
          google: await getApiKey(userEmail, 'default'),
          facebook: await getApiKey(userEmail, 'default'),
          bing: await getApiKey(userEmail, 'default'),
          searchConsole: await getApiKey(userEmail, 'default')
        };
        
        setApiKeys({
          google: apiKeys.google?.apiKey || '',
          facebook: apiKeys.facebook?.apiKey || '',
          bing: apiKeys.bing?.apiKey || '',
          searchConsole: apiKeys.searchConsole?.apiKey || ''
        });
      } catch (error) {
        console.error('Error loading API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApiKeys();
  }, [userEmail]);
  
  const handleCookieSettingChange = (setting: keyof CookieSettings) => {
    setCookieSettings(prev => {
      const newSettings = { 
        ...prev, 
        [setting]: !prev[setting] 
      };
      
      // Save to localStorage
      localStorage.setItem(CONSENT_KEY, JSON.stringify(newSettings));
      
      // Apply the new settings
      CookieConsentTracking.applyConsent(newSettings);
      
      return newSettings;
    });
  };
  
  const handleApiKeyChange = (key: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveApiKeys = async () => {
    if (!userEmail) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar as chaves de API.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Save each API key
      await Promise.all([
        storeApiKey(userEmail, 'default', apiKeys.google),
        storeApiKey(userEmail, 'default', apiKeys.facebook),
        storeApiKey(userEmail, 'default', apiKeys.bing),
        storeApiKey(userEmail, 'default', apiKeys.searchConsole)
      ]);
      
      toast({
        title: "Sucesso",
        description: "Chaves de API salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as chaves de API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
    toast({
      title: "Logout",
      description: "Você foi desconectado com sucesso.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="api">Chaves de API</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={user?.displayName || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ''} readOnly />
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>
                  Configure suas chaves de API para integração com serviços externos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-api">Google API Key</Label>
                  <Input 
                    id="google-api" 
                    value={apiKeys.google} 
                    onChange={(e) => handleApiKeyChange('google', e.target.value)}
                    placeholder="Insira sua chave de API do Google" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-console-api">Search Console API Key</Label>
                  <Input 
                    id="search-console-api" 
                    value={apiKeys.searchConsole} 
                    onChange={(e) => handleApiKeyChange('searchConsole', e.target.value)}
                    placeholder="Insira sua chave de API do Search Console" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook-api">Facebook API Key</Label>
                  <Input 
                    id="facebook-api" 
                    value={apiKeys.facebook} 
                    onChange={(e) => handleApiKeyChange('facebook', e.target.value)}
                    placeholder="Insira sua chave de API do Facebook" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bing-api">Bing API Key</Label>
                  <Input 
                    id="bing-api" 
                    value={apiKeys.bing} 
                    onChange={(e) => handleApiKeyChange('bing', e.target.value)}
                    placeholder="Insira sua chave de API do Bing" 
                  />
                </div>
                <Button 
                  onClick={handleSaveApiKeys} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Chaves de API'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Gerencie suas preferências de cookies e privacidade.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cookies Necessários</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies essenciais para o funcionamento do site.
                    </p>
                  </div>
                  <Switch 
                    checked={cookieSettings.necessary} 
                    disabled={true} // Always required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cookies Funcionais</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies que melhoram a funcionalidade do site.
                    </p>
                  </div>
                  <Switch 
                    checked={cookieSettings.functional} 
                    onCheckedChange={() => handleCookieSettingChange('functional')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cookies Analíticos</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies que nos ajudam a entender como você usa o site.
                    </p>
                  </div>
                  <Switch 
                    checked={cookieSettings.analytics} 
                    onCheckedChange={() => handleCookieSettingChange('analytics')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cookies de Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies usados para publicidade direcionada.
                    </p>
                  </div>
                  <Switch 
                    checked={cookieSettings.marketing} 
                    onCheckedChange={() => handleCookieSettingChange('marketing')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

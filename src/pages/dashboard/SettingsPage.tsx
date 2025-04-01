import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { storeApiKey, getApiKey } from '@/utils/api';

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Notification preferences schema
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketing: z.boolean().default(false),
  clientUpdates: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// API Integration schema
const apiIntegrationsFormSchema = z.object({
  googlePageInsightsKey: z.string().min(1, "A chave da API é obrigatória"),
  chatGptApiKey: z.string().min(1, "A chave da API é obrigatória"),
});

type ApiIntegrationsFormValues = z.infer<typeof apiIntegrationsFormSchema>;

// Default company data
const defaultCompanyData = {
  name: "SEO+AIO",
  email: "admin@exemplo.com",
  address: "Rua da Empresa, 123",
  city: "Lisboa",
  zipCode: "1000-100",
  phone: "+351 912 345 678",
  nif: "123456789",
};

const SettingsPage = () => {
  const { toast } = useToast();
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: defaultCompanyData.name,
      email: defaultCompanyData.email,
    },
    mode: "onChange",
  });
  
  // Notifications form
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      marketing: false,
      clientUpdates: true,
      securityAlerts: true,
    },
  });

  // API Integrations form
  const apiIntegrationsForm = useForm<ApiIntegrationsFormValues>({
    resolver: zodResolver(apiIntegrationsFormSchema),
    defaultValues: {
      googlePageInsightsKey: "",
      chatGptApiKey: "",
    },
  });

  // Carregar as chaves da API do Supabase quando o componente montar
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const googleKey = await getApiKey('googlePageInsightsKey');
        const chatGptKey = await getApiKey('chatGptApiKey');
        
        // Atualizar o formulário com as chaves obtidas
        apiIntegrationsForm.setValue('googlePageInsightsKey', googleKey || '');
        apiIntegrationsForm.setValue('chatGptApiKey', chatGptKey || '');
      } catch (error) {
        console.error('Erro ao carregar as chaves de API:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as chaves de API existentes.",
          variant: "destructive"
        });
      }
    };
    
    loadApiKeys();
  }, [apiIntegrationsForm, toast]);

  // Handle profile form submit
  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: "Perfil atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  }

  // Handle notifications form submit
  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast({
      title: "Preferências atualizadas",
      description: "As preferências de notificações foram atualizadas com sucesso.",
    });
  }

  // Handle API Integrations form submit
  async function onApiIntegrationsSubmit(data: ApiIntegrationsFormValues) {
    try {
      console.log("API Keys saved:", data);
      
      // Salvar as chaves de API no Supabase
      await storeApiKey('googlePageInsightsKey', data.googlePageInsightsKey);
      await storeApiKey('chatGptApiKey', data.chatGptApiKey);
      
      toast({
        title: "APIs configuradas",
        description: "As chaves de API foram salvas com sucesso no Supabase.",
      });
    } catch (error) {
      console.error("Erro ao salvar as chaves de API:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as chaves de API.",
        variant: "destructive"
      });
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações da sua conta e preferências
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="profile">Perfil da Empresa</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações API</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as preferências gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Modo Escuro</h3>
                      <p className="text-sm text-muted-foreground">
                        Ativa o modo escuro na interface
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Idioma</h3>
                      <p className="text-sm text-muted-foreground">
                        Escolha o idioma da interface
                      </p>
                    </div>
                    <div className="w-[180px]">
                      <select className="w-full h-10 px-3 border rounded-md">
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Fuso Horário</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure o fuso horário para datas e relatórios
                      </p>
                    </div>
                    <div className="w-[180px]">
                      <select className="w-full h-10 px-3 border rounded-md">
                        <option value="utc">UTC</option>
                        <option value="europe-lisbon" selected>Europa/Lisboa</option>
                        <option value="europe-london">Europa/Londres</option>
                      </select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button onClick={() => {
                      toast({
                        title: "Configurações salvas",
                        description: "As configurações foram atualizadas com sucesso.",
                      });
                    }}>Salvar alterações</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil da Empresa</CardTitle>
                <CardDescription>
                  Atualize as informações da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da empresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="address">Morada</Label>
                        <Input 
                          id="address"
                          defaultValue={defaultCompanyData.address}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input 
                          id="city"
                          defaultValue={defaultCompanyData.city}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input 
                          id="zipCode"
                          defaultValue={defaultCompanyData.zipCode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone"
                          defaultValue={defaultCompanyData.phone}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nif">NIF</Label>
                        <Input 
                          id="nif"
                          defaultValue={defaultCompanyData.nif}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit">Salvar alterações</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-semibold">Notificações por Email</FormLabel>
                            <FormDescription>
                              Receba notificações importantes por email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="marketing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-semibold">Marketing</FormLabel>
                            <FormDescription>
                              Receba conteúdo e ofertas por email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="clientUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-semibold">Atualizações de Clientes</FormLabel>
                            <FormDescription>
                              Seja notificado quando houver atualizações dos clientes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="securityAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-semibold">Alertas de Segurança</FormLabel>
                            <FormDescription>
                              Receba alertas sobre atividades suspeitas
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Salvar preferências</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Integrations Settings */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrações de API</CardTitle>
                <CardDescription>
                  Configure as APIs necessárias para a análise SEO e AIO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiIntegrationsForm}>
                  <form onSubmit={apiIntegrationsForm.handleSubmit(onApiIntegrationsSubmit)} className="space-y-8">
                    <FormField
                      control={apiIntegrationsForm.control}
                      name="googlePageInsightsKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Page Insights API Key</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="Insira a chave da API do Google Page Insights"
                            />
                          </FormControl>
                          <FormDescription>
                            Esta API é usada para obter dados de SEO dos sites dos clientes.
                            <a 
                              href="https://developers.google.com/speed/docs/insights/v5/get-started" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary ml-1 hover:underline"
                            >
                              Obter chave
                            </a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={apiIntegrationsForm.control}
                      name="chatGptApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OpenAI (ChatGPT) API Key</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="Insira a chave da API da OpenAI"
                            />
                          </FormControl>
                          <FormDescription>
                            Esta API é usada para análise de AIO dos conteúdos dos sites.
                            <a 
                              href="https://platform.openai.com/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary ml-1 hover:underline"
                            >
                              Obter chave
                            </a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        Eu entendo que estas chaves são sensíveis e serão salvas localmente no navegador
                      </Label>
                    </div>
                    <Button type="submit">Salvar chaves de API</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Settings */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>
                  Gerencie suas chaves de API para integração com outros sistemas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Chave API Atual</h3>
                    <div className="flex items-center mt-2">
                      <Input 
                        readOnly 
                        value="sk_test_1234567890abcdefghijklmnopqrstuvwxyz"
                        type="password"
                        className="font-mono"
                      />
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => {
                          toast({
                            title: "Chave copiada",
                            description: "A chave API foi copiada para a área de transferência.",
                          });
                        }}
                      >
                        Copiar
                      </Button>
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => {
                          toast({
                            title: "Chave visível",
                            description: "Cuidado para não compartilhar sua chave API.",
                          });
                        }}
                      >
                        Mostrar
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Permissões da API</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="read" checked />
                        <label
                          htmlFor="read"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Leitura
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="write" checked />
                        <label
                          htmlFor="write"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Escrita
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delete" />
                        <label
                          htmlFor="delete"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Exclusão
                        </label>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        toast({
                          title: "Chave regenerada",
                          description: "Uma nova chave API foi gerada com sucesso.",
                        });
                      }}
                    >
                      Regenerar chave
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Permissões salvas",
                        description: "As permissões de API foram atualizadas com sucesso.",
                      });
                    }}>Salvar permissões</Button>
                  </div>
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

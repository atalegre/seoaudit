
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, userProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      
      // Load profile data
      const fetchProfileData = async () => {
        setIsLoading(true);
        try {
          // Try to get profile data from our users table
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            // Type checking and safe access
            const userData = data as any;
            setName(userData?.name || user.user_metadata?.full_name || '');
            setRole(userData?.role || 'user');
          } else {
            // Fallback to user_metadata
            setName(user.user_metadata?.full_name || '');
            setRole(user.user_metadata?.role || 'user');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to user_metadata
          setName(user.user_metadata?.full_name || '');
          setRole(user.user_metadata?.role || 'user');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProfileData();
    }
  }, [user, userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    setIsSaving(true);
    
    try {
      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          role: role
        }
      });
      
      if (metadataError) throw metadataError;
      
      // Also update the profile in the users table
      // Use explicit property names to avoid type errors
      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: name,
          role: role
        } as any)
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar perfil", {
        description: error.message || "Tente novamente mais tarde"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Perfil de Utilizador</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e dados de contato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome Completo
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  value={email}
                  readOnly
                  disabled
                  placeholder="Seu email"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Cargo
                </label>
                <Input
                  id="role"
                  value={role}
                  readOnly
                  disabled
                  placeholder="Seu cargo"
                />
                <p className="text-xs text-muted-foreground">
                  O cargo é gerenciado pelo administrador do sistema
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Segurança da Conta</CardTitle>
          <CardDescription>
            Altere sua senha e configure a autenticação de dois fatores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Alterar Senha</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Atualize sua senha para manter sua conta segura
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard/change-password'}>
                Alterar Senha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

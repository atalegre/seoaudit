
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserPlus, AlertCircle, Info } from 'lucide-react';
import { UserFormValues } from './schemas/userFormSchema';
import UserTable from './UserTable';
import UserFormDialog from './UserFormDialog';
import { User, getAllUsers, createUser, updateUser, deleteUser } from '@/utils/api/userService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const UserManagement = () => {
  const { role: currentUserRole } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // Carregar usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      setError('Não foi possível carregar os usuários. Verifique suas permissões.');
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Abrir formulário para criar usuário
  const handleCreateUser = () => {
    setCurrentUser(null);
    setIsFormDialogOpen(true);
  };

  // Abrir formulário para editar usuário
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsFormDialogOpen(true);
  };

  // Remover usuário
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success('Usuário removido com sucesso');
      
      // Atualizar a lista
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error('Erro ao remover usuário:', error);
      toast.error(error.message || 'Não foi possível remover o usuário');
    }
  };

  // Função para copiar a senha para a área de transferência
  const copyPasswordToClipboard = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword)
        .then(() => toast.success('Senha copiada para a área de transferência'))
        .catch(err => console.error('Erro ao copiar senha:', err));
    }
  };

  // Enviar formulário
  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (currentUser) {
        // Make sure all required fields are present when updating
        const updateData = {
          name: values.name,
          email: values.email,
          role: values.role
        };
        
        // Atualizar usuário
        await updateUser(currentUser.id, updateData);
        
        toast.success('Usuário atualizado com sucesso');
      } else {
        // Criar novo usuário - all fields are required based on the schema
        try {
          const result = await createUser({
            name: values.name,
            email: values.email, 
            role: values.role
          });
          
          if (result && result.password) {
            // Guardar senha temporária e mostrar diálogo
            setTempPassword(result.password);
            setIsPasswordDialogOpen(true);
            
            // Fechar o formulário de criação
            setIsFormDialogOpen(false);
            
            // Atualizar a lista de usuários
            fetchUsers();
          }
        } catch (error: any) {
          console.error('Erro detalhado ao criar usuário:', error);
          
          // Handle specific errors with better user messages
          if (error.message?.includes('email já está em uso')) {
            toast.error('Este email já está sendo utilizado por outro usuário.');
          } else if (error.message?.includes('permission denied')) {
            toast.error('Permissão negada. O serviço está temporariamente indisponível. Tente novamente mais tarde.');
          } else if (error.message?.includes('RLS') || error.code === '42501') {
            toast.error('Permissão negada. Você não tem permissão para criar usuários. Entre em contato com um administrador.');
          } else {
            toast.error(error.message || 'Não foi possível criar o usuário');
          }
          
          // Keep dialog open when there's an error so user can fix it
          setIsSubmitting(false);
          return;
        }
      }

      // Fechar o formulário se não fechamos antes e não há diálogo de senha aberto
      if (!isPasswordDialogOpen) {
        setIsFormDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(error.message || 'Não foi possível salvar as informações do usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fechar diálogo de senha
  const closePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
    setTempPassword(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>Crie e gerencie usuários administradores</CardDescription>
          </div>
          <Button
            className="mt-2 sm:mt-0"
            onClick={handleCreateUser}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Os usuários com função de Administrador terão acesso completo ao painel de administração.
              Usuários com função de Editor podem gerenciar conteúdo e ver relatórios.
              Usuários regulares têm acesso limitado à plataforma.
              <br /><br />
              <strong>Nota:</strong> Ao criar um novo usuário, uma senha aleatória será gerada e mostrada apenas uma vez.
              Anote-a e compartilhe com o usuário, que poderá alterá-la posteriormente.
            </AlertDescription>
          </Alert>
        </div>
        
        <UserTable 
          users={users}
          loading={loading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
        
        <UserFormDialog 
          open={isFormDialogOpen} 
          onOpenChange={setIsFormDialogOpen}
          currentUser={currentUser}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />

        {/* Diálogo de exibição de senha temporária */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Senha Temporária Gerada</DialogTitle>
              <DialogDescription>
                Por favor, anote esta senha e compartilhe com o usuário. 
                Ela só será mostrada uma vez.
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 bg-gray-100 rounded-md flex items-center justify-between">
              <Input 
                value={tempPassword || ''} 
                readOnly 
                className="font-mono bg-transparent border-none focus-visible:ring-0"
              />
              <Button variant="outline" size="sm" onClick={copyPasswordToClipboard}>
                Copiar
              </Button>
            </div>
            
            <DialogFooter>
              <Button onClick={closePasswordDialog}>Entendi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;

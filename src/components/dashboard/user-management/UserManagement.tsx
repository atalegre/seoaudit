import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { UserFormValues } from './schemas/userFormSchema';
import UserTable from './UserTable';
import UserFormDialog from './UserFormDialog';
import { User, getAllUsers, createUser, updateUser, deleteUser } from '@/utils/api/userService';

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Carregar usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários',
        variant: 'destructive',
      });
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

      toast({
        title: 'Usuário removido',
        description: 'O usuário foi removido com sucesso',
      });
      
      // Atualizar a lista
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover o usuário',
        variant: 'destructive',
      });
    }
  };

  // Enviar formulário
  const onSubmit = async (values: UserFormValues) => {
    try {
      if (currentUser) {
        // Make sure all required fields are present when updating
        const updateData = {
          name: values.name,
          email: values.email,
          role: values.role
        };
        
        // Atualizar usuário
        await updateUser(currentUser.id, updateData);
        
        toast({
          title: 'Usuário atualizado',
          description: 'As informações do usuário foram atualizadas com sucesso',
        });
      } else {
        // Criar novo usuário - all fields are required based on the schema
        try {
          await createUser({
            name: values.name,
            email: values.email, 
            role: values.role
          });
          
          toast({
            title: 'Usuário criado',
            description: 'O novo usuário foi criado com sucesso',
          });
        } catch (error: any) {
          console.error('Erro detalhado ao criar usuário:', error);
          
          // Handle specific errors with better user messages
          if (error.message?.includes('email já está em uso')) {
            toast({
              title: 'Email já cadastrado',
              description: 'Este email já está sendo utilizado por outro usuário.',
              variant: 'destructive',
            });
          } else if (error.message?.includes('RLS')) {
            toast({
              title: 'Permissão negada',
              description: 'Você não tem permissão para criar usuários. Entre em contato com um administrador.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Erro',
              description: error.message || 'Não foi possível criar o usuário',
              variant: 'destructive',
            });
          }
          
          // Keep dialog open when there's an error so user can fix it
          return;
        }
      }

      // Fechar o formulário e atualizar a lista
      setIsFormDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar as informações do usuário',
        variant: 'destructive',
      });
    }
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
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;

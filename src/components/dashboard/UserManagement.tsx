
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Plus, Trash, UserPlus } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  created_at?: string;
};

// Form schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.enum(['admin', 'editor', 'user'], {
    required_error: 'Por favor, selecione uma função',
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  });

  // Carregar usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
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
    form.reset({
      name: '',
      email: '',
      role: 'user',
    });
    setIsFormDialogOpen(true);
  };

  // Abrir formulário para editar usuário
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsFormDialogOpen(true);
  };

  // Remover usuário
  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Usuário removido',
        description: 'O usuário foi removido com sucesso',
      });
      
      // Atualizar a lista
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o usuário',
        variant: 'destructive',
      });
    }
  };

  // Enviar formulário
  const onSubmit = async (values: UserFormValues) => {
    try {
      if (currentUser) {
        // Atualizar usuário
        const { error } = await supabase
          .from('users')
          .update({
            name: values.name,
            email: values.email,
            role: values.role,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUser.id);

        if (error) throw error;
        
        toast({
          title: 'Usuário atualizado',
          description: 'As informações do usuário foram atualizadas com sucesso',
        });
      } else {
        // Criar novo usuário
        const { data, error } = await supabase
          .from('users')
          .insert({
            name: values.name,
            email: values.email,
            role: values.role,
          })
          .select();

        if (error) throw error;
        
        toast({
          title: 'Usuário criado',
          description: 'O novo usuário foi criado com sucesso',
        });
      }

      // Fechar o formulário e atualizar a lista
      setIsFormDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as informações do usuário',
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Nenhum usuário encontrado</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary/20 text-primary' 
                        : user.role === 'editor' 
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === 'admin' 
                        ? 'Administrador' 
                        : user.role === 'editor' 
                          ? 'Editor' 
                          : 'Usuário'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Editar"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Excluir"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Diálogo de Formulário */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {currentUser 
                ? 'Atualize as informações deste usuário.'
                : 'Preencha os campos para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
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
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Os administradores têm acesso completo ao sistema.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;

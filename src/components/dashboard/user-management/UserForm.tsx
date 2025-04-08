
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User } from '@/utils/api/userService';
import { userFormSchema, UserFormValues } from './schemas/userFormSchema';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

interface UserFormProps {
  currentUser: User | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  currentUser, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const { role: currentUserRole } = useUser();
  const isAdmin = currentUserRole === 'admin';

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      role: currentUser?.role || 'user',
    },
  });

  const selectedRole = form.watch('role');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
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
                <Input {...field} disabled={isSubmitting || (currentUser !== null)} />
              </FormControl>
              {currentUser && (
                <FormDescription>
                  O email não pode ser alterado depois que o usuário é criado.
                </FormDescription>
              )}
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
                disabled={!isAdmin || isSubmitting}
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
                {selectedRole === 'admin' 
                  ? 'Administradores têm acesso completo ao sistema, incluindo todas as configurações.'
                  : selectedRole === 'editor'
                  ? 'Editores podem gerenciar conteúdo e ver relatórios.'
                  : 'Usuários têm acesso básico à plataforma.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentUser ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              currentUser ? 'Salvar Alterações' : 'Criar Usuário'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserForm;

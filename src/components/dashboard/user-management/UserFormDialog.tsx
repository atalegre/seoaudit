
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/utils/api/userService';
import UserForm from './UserForm';
import { UserFormValues } from './schemas/userFormSchema';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, onOpenChange, currentUser, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        
        <UserForm 
          currentUser={currentUser} 
          onSubmit={onSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;

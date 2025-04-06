
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Shield } from 'lucide-react';
import { User } from '@/utils/api/userService';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onEdit, onDelete }) => {
  // Função para mostrar o papel (role) de forma mais legível em português
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'editor':
        return 'Editor';
      case 'user':
        return 'Usuário';
      default:
        return role;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-[120px]">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Função</span>
            </div>
          </TableHead>
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
                  {getRoleLabel(user.role)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    title="Editar"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    title="Excluir"
                    onClick={() => onDelete(user.id)}
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
  );
};

export default UserTable;

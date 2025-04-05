
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ClientActionsMenuProps {
  clientId: number;
}

const ClientActionsMenu: React.FC<ClientActionsMenuProps> = ({ clientId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewClient = () => {
    navigate(`/dashboard/client/${clientId}`);
  };
  
  const handleEditClient = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de clientes será implementada em breve.",
    });
  };
  
  const handleDeleteClient = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de clientes será implementada em breve.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleViewClient()}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditClient()}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleDeleteClient()}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientActionsMenu;

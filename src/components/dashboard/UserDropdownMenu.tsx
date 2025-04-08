
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserDropdownMenuProps {
  userName: string;
  userEmail: string;
  userRole: string;
  user: any;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ 
  userName, 
  userEmail, 
  userRole,
  user 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/signin');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message,
      });
    }
  };

  const handleChangePassword = () => {
    // Navigate to the correct change password page based on role
    navigate(userRole === 'admin' ? '/dashboard/change-password' : '/dashboard/client/change-password');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 ml-2 md:ml-4 cursor-pointer">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="text-xs md:text-sm font-medium">{userName}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.user_metadata?.full_name || (userRole === 'admin' ? 'Admin' : 'Cliente')}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha conta ({userRole})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(userRole === 'admin' ? '/dashboard/profile' : '/dashboard/client/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(userRole === 'admin' ? '/dashboard/settings' : '/dashboard/client/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleChangePassword}>
          <Lock className="mr-2 h-4 w-4" />
          <span>Alterar senha</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;

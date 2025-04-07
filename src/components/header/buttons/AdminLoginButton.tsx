
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/utils/auth/signinService';

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAdminLogin = async () => {
    try {
      // Login direto como admin usando credenciais padrão
      const { data, error } = await signInWithEmail('atalegre@me.com', 'admin123');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Falha ao entrar como administrador",
        });
        return;
      }
      
      if (data?.user) {
        toast({
          title: "Login Admin",
          description: "Login como administrador realizado com sucesso!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Erro ao fazer login como admin:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao entrar como administrador. Tente novamente.",
      });
    }
  };
  
  return (
    <Button 
      variant="destructive" 
      onClick={handleAdminLogin}
      className="flex items-center gap-2"
    >
      <Lock className="h-4 w-4" />
      Admin
    </Button>
  );
};

export default AdminLoginButton;

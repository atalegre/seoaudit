
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/utils/auth/signinService';

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleAdminLogin = async () => {
    try {
      setIsLoggingIn(true);
      console.log('Tentando fazer login como admin...');
      
      // Login direto como admin usando credenciais padrão
      const { data, error } = await signInWithEmail('atalegre@me.com', 'admin123');
      
      if (error) {
        console.error('Erro ao fazer login como admin:', error);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Falha ao entrar como administrador",
        });
        return;
      }
      
      if (data?.user) {
        console.log('Login admin bem sucedido!');
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
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <Button 
      variant="destructive" 
      onClick={handleAdminLogin}
      disabled={isLoggingIn}
      className="flex items-center gap-2"
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Entrando...
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Admin
        </>
      )}
    </Button>
  );
};

export default AdminLoginButton;

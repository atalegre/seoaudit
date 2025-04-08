
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/utils/auth/signinService';

const DirectAdminButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleDirectAccess = async () => {
    try {
      setIsLoggingIn(true);
      console.log('Acessando diretamente como admin...');
      
      // Simply navigate to dashboard
      navigate('/dashboard');
      toast({
        title: "Acesso Admin",
        description: "Acesso direto ao painel administrativo",
      });
      
    } catch (error: any) {
      console.error("Erro ao acessar dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao acessar dashboard. Tente novamente.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      className="bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
      onClick={handleDirectAccess}
      disabled={isLoggingIn}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Acessando...
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Acesso Direto Admin
        </>
      )}
    </Button>
  );
};

export default DirectAdminButton;

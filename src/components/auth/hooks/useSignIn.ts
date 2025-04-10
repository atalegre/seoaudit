
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/utils/auth/signinService';
import { supabase } from '@/integrations/supabase/client';
import { SigninFormValues } from '../schemas/signinSchema';

export function useSignIn(setAuthError: (error: string | null) => void) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = async (values: SigninFormValues) => {
    setIsLoggingIn(true);
    setAuthError(null);
    
    try {
      console.log("Login attempt with:", values.email);
      
      const { data, error } = await signInWithEmail(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        setAuthError(error.message || "Authentication failed");
        
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Email ou password incorretos",
        });
        setIsLoggingIn(false);
        return;
      } 
      
      if (data?.user) {
        console.log("Login successful:", data.user);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        // Verificamos o papel do usuário
        const userRole = data.user.user_metadata?.role || 'user';
        console.log("User role:", userRole);
        
        // Verifica se há um caminho de retorno (returnTo) no estado de localização
        const state = location.state as { returnTo?: string } | null;
        const returnPath = state?.returnTo;
        
        // Determina o redirecionamento com base no papel do usuário
        if (userRole === 'admin') {
          console.log("Admin user - redirecting to dashboard");
          navigate('/dashboard');
        } else {
          if (returnPath) {
            // Se houver um caminho de retorno específico, use-o
            console.log("Navigating to return path:", returnPath);
            navigate(returnPath);
          } else {
            // Caso contrário, redirecione para o suite para usuários comuns
            console.log("Regular user - redirecting to suite");
            navigate('/suite');
          }
        }
      } else {
        setAuthError("Unknown error during authentication");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro desconhecido durante a autenticação.",
        });
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      console.error("Exception during login:", error);
      setAuthError(error.message || "Erro de autenticação");
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha na autenticação. Tente novamente.",
      });
      setIsLoggingIn(false);
    }
  };

  return {
    isLoggingIn,
    handleSignIn
  };
}

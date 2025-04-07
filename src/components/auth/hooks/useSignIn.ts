
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
        
        // Check user role to determine where to navigate
        let role = 'user';
        
        // Special case for admin email
        if (values.email === 'atalegre@me.com') {
          role = 'admin';
        } else {
          // Check user metadata first
          role = data.user.user_metadata?.role || 'user';
          
          // If not in metadata, check database
          if (role !== 'admin') {
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle();
              
              if (!userError && userData && 'role' in userData) {
                if (userData.role === 'admin') {
                  role = 'admin';
                }
              }
            } catch (err) {
              console.error("Error checking user role:", err);
            }
          }
        }
        
        // Check if there's a returnTo path in the location state
        const state = location.state as { returnTo?: string } | null;
        const returnPath = state?.returnTo;
        
        if (returnPath) {
          // Navigate to the original path the user was trying to access
          console.log("Navigating to return path:", returnPath);
          navigate(returnPath);
        } else {
          // Navigate based on role
          console.log("Navigating based on role:", role);
          navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
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

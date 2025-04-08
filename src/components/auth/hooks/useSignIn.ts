
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
        
        // Check if there's a returnTo path in the location state
        const state = location.state as { returnTo?: string } | null;
        const returnPath = state?.returnTo;
        
        // Check if we're in development or production
        const isDevelopment = window.location.hostname === 'localhost' ||
                           window.location.hostname.includes('lovable');
        
        if (isDevelopment) {
          // For development environment
          if (returnPath) {
            // Navigate to the original path the user was trying to access
            console.log("Navigating to return path:", returnPath);
            navigate(returnPath);
          } else {
            // Navigate to the suite dashboard
            console.log("Navigating to suite dashboard");
            navigate('/suite');
          }
        } else {
          // For production - redirect to the subdomain in a new tab
          const lastAnalyzedUrl = localStorage.getItem('lastAnalyzedUrl');
          const queryParam = lastAnalyzedUrl ? `?url=${encodeURIComponent(lastAnalyzedUrl)}` : '';
          window.open(`https://suite.seoaudit.pt${queryParam}`, '_blank');
          
          // Navigate to the homepage in the current tab
          navigate('/');
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

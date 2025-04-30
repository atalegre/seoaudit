
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log("Signing out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Using the correct sonner toast API
      toast.success("Logout bem-sucedido", {
        description: "Você foi desconectado com sucesso."
      });
      
      // Force redirect to signin page
      navigate('/signin', { replace: true });
    } catch (error: any) {
      console.error('Error signing out:', error);
      // Using the correct sonner toast API for errors
      toast.error("Erro ao fazer logout", {
        description: error.message,
      });
    }
  };

  return { handleSignOut };
};

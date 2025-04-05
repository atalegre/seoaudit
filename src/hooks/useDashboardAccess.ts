
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useDashboardAccess = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();

  const handleDashboardAccess = () => {
    if (user) {
      // If user is already logged in, navigate directly to dashboard
      navigate('/dashboard/client');
      
      toast({
        title: "Acesso ao relatório",
        description: "Redirecionando para o seu relatório completo",
      });
    } else {
      // If not logged in, redirect to sign in page
      navigate('/signin', { 
        state: { 
          returnTo: '/dashboard/client',
          message: "Faça login ou registe-se para aceder ao relatório completo"
        }
      });
      
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login ou registe-se para aceder ao relatório completo",
      });
    }
  };

  return { handleDashboardAccess };
};


import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export const useDashboardAccess = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleDashboardAccess = () => {
    if (user) {
      // If user is logged in, navigate directly to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, redirect to sign in page
      navigate('/signin');
    }
  };

  return { handleDashboardAccess };
};

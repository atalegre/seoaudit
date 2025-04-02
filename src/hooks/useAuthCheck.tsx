
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkUserRole } from '@/utils/auth/authService';

interface UseAuthCheckResult {
  user: any;
  userEmail: string;
  userName: string;
  userRole: string;
  isLoading: boolean;
}

export const useAuthCheck = (): UseAuthCheckResult => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('AD');
  const [userRole, setUserRole] = useState<string>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setUserEmail(session.user.email || '');
          
          // Get user name from user metadata if available
          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(getInitials(fullName));
          }
          
          // Get user role
          const role = await checkUserRole(session.user.id);
          setUserRole(role);
          
          // Check access permissions
          const pathParts = location.pathname.split('/');
          if (pathParts[1] === 'dashboard') {
            if (pathParts[2] === undefined && role !== 'admin') {
              // Non-admins trying to access main dashboard should be redirected
              navigate('/dashboard/client');
            } else if (role === 'admin' && pathParts[2] === 'client' && !pathParts[3]) {
              // Admins can view client dashboard if they explicitly go there
              // No redirect needed here
            }
          }
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/signin');
        } else if (session) {
          setUser(session.user);
          setUserEmail(session.user.email || '');
          
          // Get user name from user metadata if available
          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(getInitials(fullName));
          }
          
          // Update role
          const role = await checkUserRole(session.user.id);
          setUserRole(role);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    user,
    userEmail,
    userName,
    userRole,
    isLoading
  };
};

export default useAuthCheck;

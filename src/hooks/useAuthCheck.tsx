
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const [userName, setUserName] = useState<string>('Guest');
  const [userRole, setUserRole] = useState<string>('user'); // Default to user role
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
          } else if (session.user.email) {
            // Use first part of email if no full name
            setUserName(getInitials(session.user.email.split('@')[0]));
          }
          
          // Get user role from email
          const role = session.user.email === 'atalegre@me.com' ? 'admin' : 'user';
          setUserRole(role);
        } else {
          // Set default values for non-authenticated users
          setUser(null);
          setUserEmail('');
          setUserName('Guest');
          setUserRole('user'); // Default to user role for non-authenticated users
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
          setUserEmail(session.user.email || '');
          
          // Get user name from user metadata if available
          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(getInitials(fullName));
          } else if (session.user.email) {
            setUserName(getInitials(session.user.email.split('@')[0]));
          }
          
          // Get user role
          const role = session.user.email === 'atalegre@me.com' ? 'admin' : 'user';
          setUserRole(role);
        } else {
          setUser(null);
          setUserEmail('');
          setUserName('Guest');
          setUserRole('user');
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

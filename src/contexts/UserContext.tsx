
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserContextType = {
  user: any;
  role: string;
  loading: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  role: 'admin', // Default role to admin for non-authenticated users
  loading: false
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('admin'); // Default to admin role
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          // Set role based on email
          setRole(session.user.email === 'atalegre@me.com' ? 'admin' : 'user');
        } else {
          // If no user is authenticated, default to admin role
          setRole('admin');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

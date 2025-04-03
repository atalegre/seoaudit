
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkUserRole, getUserProfile } from '@/utils/auth/userProfileService';
import { UserProfile } from '@/utils/auth/types';

export type UserContextType = {
  user: any;
  userProfile: UserProfile | null;
  role: string;
  loading: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  userProfile: null,
  role: 'admin', // Default role to admin for non-authenticated users
  loading: false
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>('admin'); // Default to admin role
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUserProfile(userId: string) {
      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          setUserProfile(profile as UserProfile);
          setRole(profile.role);
        } else {
          // If no profile exists yet but we have a user, default to user role
          // unless it's the admin email
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user?.email === 'atalegre@me.com') {
            setRole('admin');
          } else {
            setRole('user');
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user || null);
        
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setRole('admin');  // Default to admin when logged out
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userProfile, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

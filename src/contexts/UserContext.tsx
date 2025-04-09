
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserProfile } from '@/utils/auth/userProfileService';
import { UserProfile } from '@/utils/auth/types';
import { toast } from 'sonner';

export type UserContextType = {
  user: any;
  userProfile: UserProfile | null;
  role: string;
  loading: boolean;
  setRole: (role: string) => void;
};

// Create context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  userProfile: null,
  role: 'admin', // Default role to admin for non-authenticated users
  loading: false,
  setRole: () => {},
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>('admin'); // Default to admin role for easier testing
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUserProfile(userId: string) {
      try {
        const profile = await getUserProfile(userId);
        
        // Check if profile is an error or valid profile data
        if (profile && typeof profile === 'object' && !('error' in profile)) {
          // Use type assertion to ensure TypeScript knows this is a UserProfile
          const userProfileData = profile as UserProfile;
          setUserProfile(userProfileData);
          
          // Safely access the role property with nullish check
          if (userProfileData && userProfileData.role) {
            setRole(userProfileData.role);
          } else {
            // Default if role is not found
            setRole('admin'); // Set to admin for testing
          }
        } else {
          // If no profile exists yet but we have a user, default to admin role
          // unless it's not the admin email
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user?.email === 'atalegre@me.com') {
            setRole('admin');
          } else {
            // Set to admin for testing
            setRole('admin');
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setRole('admin'); // Default to admin for testing
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
          setRole('admin');  // Default to admin when logged out for testing
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Create a setter function for role that we can expose to components
  const updateRole = (newRole: string) => {
    setRole(newRole);
    toast.success(`Perfil atualizado para ${newRole}`);
  };

  return (
    <UserContext.Provider value={{ user, userProfile, role, loading, setRole: updateRole }}>
      {children}
    </UserContext.Provider>
  );
};

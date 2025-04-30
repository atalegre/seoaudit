
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
  role: 'user', // Default role to user for non-authenticated users
  loading: true,
  setRole: () => {},
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>('user'); // Default to user role
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("UserProvider - Initializing auth state");
    
    async function loadUserProfile(userId: string) {
      try {
        console.log("Loading user profile for:", userId);
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
            setRole('user'); 
          }
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
        setRole('user'); 
      } finally {
        setLoading(false);
      }
    }

    // First check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("UserProvider - Initial session check:", session?.user?.email);
      setUser(session?.user || null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });
    
    // Then set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("UserProvider - Auth state changed:", event, session?.user?.email);
        
        // Update user state immediately
        setUser(session?.user || null);
        
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setRole('user');  // Default to user when logged out
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

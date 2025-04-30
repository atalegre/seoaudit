
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
    
    // CRITICAL: Add a shorter safety timeout (1 second) to prevent infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log("UserProvider - Safety timeout triggered after 1s, setting loading to false");
        setLoading(false);
      }
    }, 1000);
    
    // Initialize auth state immediately with a synchronous update
    const initAuth = async () => {
      try {
        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        const session = data?.session;
        console.log("UserProvider - Initial session check:", session?.user?.email || "No session");
        
        // Update state
        setUser(session?.user || null);
        
        if (session?.user) {
          try {
            // Load user profile
            const profile = await getUserProfile(session.user.id);
            
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
              if (session.user.email === 'atalegre@me.com') {
                setRole('admin');
              } else {
                setRole('user');
              }
            }
          } catch (profileError) {
            console.error('Error loading user profile:', profileError);
            setRole('user');
          }
        }
      } catch (e) {
        console.error("Fatal error initializing auth:", e);
      } finally {
        // Always ensure loading is set to false
        setLoading(false);
      }
    };
    
    // Execute initialization
    initAuth();
    
    // Set up auth state listener for changes after initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("UserProvider - Auth state changed:", event, session?.user?.email);
        
        // Update user state immediately
        setUser(session?.user || null);
        
        if (!session?.user) {
          setUserProfile(null);
          setRole('user');
          return;
        }
        
        // Load user profile asynchronously - don't block UI
        getUserProfile(session.user.id)
          .then((profile) => {
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
              if (session.user.email === 'atalegre@me.com') {
                setRole('admin');
              } else {
                setRole('user');
              }
            }
          })
          .catch(error => {
            console.error('Error loading user profile:', error);
            setRole('user');
          });
      }
    );

    return () => {
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
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

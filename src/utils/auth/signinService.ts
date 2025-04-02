
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminUserInDb, ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // Demo user login handling
    const isDemoAdmin = email === 'atalegre@me.com' && password === 'admin123';
    const isDemoClient = email === 'seoclient@exemplo.com' && password === 'client123';
    
    if (isDemoAdmin || isDemoClient) {
      console.log(`Processing demo user login: ${email}`);
      
      // First try direct login
      let authResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If login fails, try to create the account
      if (authResult.error) {
        console.log("Demo user login failed, attempting to create account");
        
        const { error: signUpError } = await supabase.auth.signUp({
          email, 
          password,
          options: {
            data: {
              full_name: isDemoAdmin ? 'SEO Admin' : 'SEO Client',
              role: isDemoAdmin ? 'admin' : 'user',
            }
          }
        });
        
        if (signUpError) {
          console.error("Failed to create demo account:", signUpError);
          throw signUpError;
        }
        
        // Try logging in again after signup
        authResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (authResult.error) {
          console.error("Demo user login failed after signup:", authResult.error);
          throw authResult.error;
        }
      }
      
      // Ensure user exists in database with proper role
      if (authResult.data?.user) {
        if (isDemoAdmin) {
          await ensureAdminUserInDb(authResult.data.user.id, email);
        } else {
          await ensureUserInDb(
            authResult.data.user.id,
            email,
            'SEO Client',
            'user'
          );
        }
        
        return { data: authResult.data, error: null };
      } else {
        throw new Error("Failed to authenticate demo user");
      }
    } 
    else {
      // Standard login for non-demo users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login failed:", error);
        throw error;
      }
      
      if (data?.user) {
        console.log("Standard login successful");
        
        // Ensure user profile exists in database
        const isAdmin = email === 'atalegre@me.com';
        if (isAdmin) {
          await ensureAdminUserInDb(data.user.id, email);
        } else {
          await ensureUserInDb(
            data.user.id, 
            data.user.email || '', 
            data.user.user_metadata?.full_name || 'User',
            'user'
          );
        }
        
        return { data, error: null };
      } else {
        throw new Error("User data not available after login");
      }
    }
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}

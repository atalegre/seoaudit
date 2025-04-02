
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminUserInDb, ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // First attempt to login directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If login successful, ensure user profile exists in database
    if (data?.user) {
      console.log("Login successful for:", email);
      
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
    }
    
    // If login failed and this is a demo account, try to create it first
    if (error && (email === 'atalegre@me.com' || email === 'seoclient@exemplo.com')) {
      console.log("Login failed for demo account, attempting to create it first:", email);
      
      const isDemoAdmin = email === 'atalegre@me.com';
      
      // Create the demo account
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
      
      if (signUpError && signUpError.message !== 'User already registered') {
        console.error("Failed to create demo account:", signUpError);
        return { data: null, error: signUpError };
      }
      
      // Try to login again
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (loginError) {
        console.error("Demo login failed:", loginError);
        return { data: null, error: loginError };
      }
      
      if (loginData?.user) {
        // Ensure user profile exists
        if (isDemoAdmin) {
          await ensureAdminUserInDb(loginData.user.id, email);
        } else {
          await ensureUserInDb(
            loginData.user.id,
            email,
            isDemoAdmin ? 'SEO Admin' : 'SEO Client',
            isDemoAdmin ? 'admin' : 'user'
          );
        }
        
        return { data: loginData, error: null };
      }
    }
    
    // Return the original error if we couldn't fix it
    return { data, error };
    
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}

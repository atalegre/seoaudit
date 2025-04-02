
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminUserInDb, ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // First try a direct signin
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      console.log("Standard signin successful");
      
      // Ensure user exists in users table with proper role
      if (data.user) {
        if (email === 'atalegre@me.com') {
          await ensureAdminUserInDb(data.user.id, email);
        } else {
          await ensureUserInDb(
            data.user.id, 
            data.user.email || '', 
            data.user.user_metadata?.full_name || 'User',
            data.user.email === 'atalegre@me.com' ? 'admin' : 'user'
          );
        }
      }
      
      return { data, error: null };
    }
    
    // Special handling for our demo users
    if (
      (email === 'atalegre@me.com' && password === 'admin123') ||
      (email === 'seoclient@exemplo.com' && password === 'client123')
    ) {
      console.log(`Special handling for demo user: ${email}`);
      
      // Try to create the user if they don't exist
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            full_name: email === 'atalegre@me.com' ? 'SEO Admin' : 'SEO Client',
            role: email === 'atalegre@me.com' ? 'admin' : 'user',
          }
        }
      });
      
      if (!signUpError || signUpError.message.includes('already registered')) {
        // Now try logging in again
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!signInError) {
          console.log("Demo user signin successful after account creation/update");
          
          // Ensure user exists in users table with proper role
          if (signInData.user) {
            if (email === 'atalegre@me.com') {
              await ensureAdminUserInDb(signInData.user.id, email);
            } else {
              await ensureUserInDb(
                signInData.user.id,
                email,
                email === 'atalegre@me.com' ? 'SEO Admin' : 'SEO Client',
                email === 'atalegre@me.com' ? 'admin' : 'user'
              );
            }
          }
          
          return { data: signInData, error: null };
        } else {
          console.error("Demo user still failed to login:", signInError);
          throw signInError;
        }
      }
    }
    
    // If we get here, signin failed and we couldn't fix it
    console.error("Signin failed with error:", error);
    throw error;
  } catch (error: any) {
    console.error("Exception during signin:", error);
    throw error;
  }
}

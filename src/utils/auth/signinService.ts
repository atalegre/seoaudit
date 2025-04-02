
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminUserInDb, ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // Check if this is a demo account
    const isDemoAdmin = email === 'atalegre@me.com' && password === 'admin123';
    const isDemoClient = email === 'seoclient@exemplo.com' && password === 'client123';
    
    if (isDemoAdmin || isDemoClient) {
      console.log(`Processing demo user login: ${email}`);
      
      // For demo accounts, first create the account if it doesn't exist
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
      
      // If signup returned an error that's not "user already exists", log it
      if (signUpError && signUpError.message !== 'User already registered') {
        console.error("Demo account creation error:", signUpError);
        // Continue to login attempt even if signup failed
      } else {
        console.log("Demo account created or already exists");
      }
      
      // Now attempt to login with credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Demo user login failed:", error);
        return { data: null, error };
      }
      
      if (data?.user) {
        console.log("Demo login successful, ensuring user DB entry");
        
        // Ensure user exists in database with proper role
        if (isDemoAdmin) {
          await ensureAdminUserInDb(data.user.id, email);
        } else {
          await ensureUserInDb(
            data.user.id,
            email,
            'SEO Client',
            'user'
          );
        }
        
        return { data, error: null };
      } else {
        return { data: null, error: new Error("Failed to authenticate demo user") };
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
        return { data: null, error };
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
        return { data: null, error: new Error("User data not available after login") };
      }
    }
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}

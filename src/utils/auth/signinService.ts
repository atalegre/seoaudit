
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminUserInDb, ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  // Special case for admin user with known credentials
  if (email === 'atalegre@me.com' && password === 'admin123') {
    // First check if this user exists - if not, create it
    try {
      // Try to sign in first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        console.log("Admin user exists and signed in successfully");
        
        // Make sure they're marked as admin in the users table
        if (data.user) {
          await ensureAdminUserInDb(data.user.id, email);
        }
        return { data, error: null };
      }
      
      // If error, user might not exist or has wrong password, try to create/update
      console.log("Admin user sign-in failed, attempting to create:", error);
      
      // Create admin user with signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            full_name: 'SEO Admin',
            role: 'admin',
          }
        }
      });
      
      if (signUpError) {
        // If cannot create, try to update password instead
        console.error("Admin signup failed:", signUpError);
        throw signUpError;
      }
      
      if (signUpData.user) {
        // Ensure user exists in users table
        await ensureAdminUserInDb(signUpData.user.id, email);
        
        // Try signing in again
        return supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      
      throw new Error("Failed to create admin user");
    } catch (error) {
      console.error("Admin user creation failed:", error);
      throw error;
    }
  }
  
  // Standard login for non-admin users
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("SignIn error:", error);
    throw error;
  }

  // Try to ensure the user exists in the users table
  if (data.user) {
    try {
      await ensureUserInDb(
        data.user.id, 
        data.user.email || '', 
        data.user.user_metadata?.full_name || 'User',
        data.user.email === 'atalegre@me.com' ? 'admin' : 'user'
      );
    } catch (err) {
      console.error("Error ensuring user in users table:", err);
    }
  }

  return { data, error: null };
}

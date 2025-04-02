
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminUserInDb, ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // For demo users, use a simplified approach
    if ((email === 'atalegre@me.com' && password === 'admin123') || 
        (email === 'seoclient@exemplo.com' && password === 'client123')) {
      
      const isAdmin = email === 'atalegre@me.com';
      console.log(`Special handling for demo user: ${email}`);
      
      // Try to create the account first (will fail if exists, but that's ok)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            full_name: isAdmin ? 'SEO Admin' : 'SEO Client',
            role: isAdmin ? 'admin' : 'user',
          }
        }
      });
      
      // Now try to sign in regardless of whether signup succeeded
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        console.log("Demo user login successful");
        
        // Ensure user exists in database with proper role
        if (isAdmin) {
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
        console.error("Demo user login failed:", error);
        throw error || new Error("Failed to authenticate");
      }
    } 
    else {
      // Standard login for non-demo users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
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
        console.error("Standard login failed:", error);
        throw error || new Error("Failed to authenticate");
      }
    }
  } catch (error: any) {
    console.error("Exception during login:", error);
    throw error;
  }
}

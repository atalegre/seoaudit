
import { supabase } from '@/integrations/supabase/client';
import { ensureUserInDb } from './profileService';
import { isAdminEmail } from './adminUserService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // Regular login flow
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      return { data: null, error };
    }
    
    // Ensure user data exists in database
    if (data?.user) {
      try {
        // Get user metadata
        const fullName = data.user.user_metadata?.full_name || 'User';
        
        // Special handling for admin email
        const role = isAdminEmail(email) ? 'admin' : 'user';
        
        await ensureUserInDb(
          data.user.id,
          email,
          fullName,
          role
        );
      } catch (err) {
        console.error("Error ensuring user in database during login:", err);
        // Continue login flow even if this fails
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}

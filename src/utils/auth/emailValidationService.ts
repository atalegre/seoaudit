
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if an email already exists in users table
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!email) {
    console.error("No email provided to checkEmailExists");
    return false;
  }
  
  // For the admin email, we want to allow signup attempts
  if (email === 'atalegre@me.com') {
    return false;
  }
  
  try {
    console.log("Checking if email exists:", email);
    
    // Check in the public.users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking email existence:", error);
      return true; // Assume it might exist to prevent duplicate entries
    }
    
    const exists = !!data;
    console.log("Email existence check result:", exists);
    return exists;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return true; // Assume it might exist to prevent duplicate entries
  }
}

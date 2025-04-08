
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if an email already exists in the users table
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Check if email exists in the users table first
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking users for email:", error);
      throw error;
    }
    
    // If found in users table, return true
    if (data) {
      return true;
    }
    
    // Fallback: Just return false since auth admin API requires service role
    // which we likely don't have in the client
    return false;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    // Return false to avoid blocking registration in case of errors
    return false;
  }
}


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
      return false;
    }
    
    // If found in users table, return true
    if (data) {
      return true;
    }
    
    // Since we can't access auth.users directly with regular API calls,
    // we'll have to trust the database check only
    return false;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    // Return false to avoid blocking registration in case of errors
    return false;
  }
}

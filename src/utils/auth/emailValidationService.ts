
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
      // Continue even if there's an error to check auth users
    }
    
    // If found in users table, return true
    if (data) {
      return true;
    }
    
    // Also check auth users (using admin API)
    const { data: users, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error checking auth users for email:", authError);
      // Return false in case of errors to avoid blocking registration
      return false;
    }
    
    // Check if the email exists in the auth users list
    const emailExists = users.users.some((user: any) => user.email === email);
    return emailExists;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    // Return false to avoid blocking registration in case of errors
    return false;
  }
}

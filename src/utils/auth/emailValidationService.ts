
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if an email already exists in the users table
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Check auth table - using the correct parameters for listUsers
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    
    if (authError) {
      console.error("Error checking auth for email:", authError);
    }
    
    // Look for the email in the returned users
    const emailExists = authData?.users.some(user => user.email === email);
    if (emailExists) {
      return true;
    }
    
    // Check users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking users for email:", error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    // Return false to avoid blocking registration in case of errors
    return false;
  }
}

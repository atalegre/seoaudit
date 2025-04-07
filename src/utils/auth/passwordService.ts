
import { supabase } from '@/integrations/supabase/client';

/**
 * Send a password reset email
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Error sending reset password email:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Exception during password reset:", error);
    throw error;
  }
}

/**
 * Update the user's password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      console.error("Error updating password:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Exception during password update:", error);
    throw error;
  }
}

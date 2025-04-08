
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
    
    return { success: true };
  } catch (error) {
    console.error("Exception during password reset:", error);
    throw error;
  }
}

/**
 * Update the user's password
 */
export async function updatePassword(newPassword: string, currentPassword?: string) {
  try {
    // If currentPassword is provided, we need to verify it first
    if (currentPassword) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword,
      });
      
      if (error) {
        throw new Error('Senha atual incorreta');
      }
      
      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        throw updateError;
      }
    } else {
      // This is used during password reset flow
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Exception during password update:", error);
    throw error;
  }
}

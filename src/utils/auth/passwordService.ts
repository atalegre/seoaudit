
import { supabase } from '@/integrations/supabase/client';

/**
 * Send a password reset email
 */
export async function resetPassword(email: string) {
  try {
    // Determine if in production environment
    const isProd = typeof window !== 'undefined' && 
                  (window.location.hostname === 'seoaudit.pt' || 
                   window.location.hostname.includes('suite.seoaudit.pt'));
    
    // Configure redirect URL based on environment
    const redirectUrl = isProd 
      ? 'https://seoaudit.pt/reset-password' 
      : `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error("Error sending reset password email:", error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Exception during password reset:", error);
    return { success: false, error };
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

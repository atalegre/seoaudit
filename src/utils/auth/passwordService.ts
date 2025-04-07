
import { supabase } from '@/integrations/supabase/client';

/**
 * Sends a password reset email
 */
export async function resetPassword(email: string) {
  const siteUrl = window.location.origin;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    console.error("Reset password error:", error);
    throw error;
  }
  
  console.log(`Password reset email sent to ${email} with redirect to ${siteUrl}/reset-password`);
  return { success: true };
}

/**
 * Updates the user's password
 */
export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Update password error:", error);
    throw error;
  }
  
  console.log("Password updated successfully");
  return { success: true };
}


import { supabase } from '@/integrations/supabase/client';

/**
 * Sends a verification email to a newly registered user
 */
export async function sendVerificationEmail(email: string, name?: string): Promise<boolean> {
  try {
    console.log('Sending verification email to:', email);
    
    // Create confirmation URL
    const confirmationUrl = `${window.location.origin}/auth/callback?next=/dashboard/client`;
    console.log('Using confirmation URL:', confirmationUrl);
    
    // Try to send via edge function first
    try {
      const functionResponse = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          email,
          name: name || 'Utilizador',
          confirmationUrl
        }
      });
      
      if (functionResponse.error) {
        throw new Error(`Custom email error: ${JSON.stringify(functionResponse.error)}`);
      }
      
      console.log('Custom verification email sent successfully via function');
      return true;
    } catch (customErr) {
      console.error('Error sending custom verification email:', customErr);
      // Continue with standard method as fallback
    }
    
    // Fallback to the standard Supabase method
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: confirmationUrl
      }
    });
    
    if (error) {
      console.error('Error sending standard verification email:', error);
      return false;
    }
    
    console.log('Standard verification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    return false;
  }
}

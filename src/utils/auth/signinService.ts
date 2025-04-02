
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateAdmin, createOrUpdateClient } from './createDefaultUsers';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // Special handling for demo accounts - always try to create them first
    if (email === 'atalegre@me.com' || email === 'seoclient@exemplo.com') {
      console.log("Demo account login detected:", email);
      
      // Setup demo accounts first
      if (email === 'atalegre@me.com') {
        await createOrUpdateAdmin();
      } else {
        await createOrUpdateClient();
      }
    }
    
    // Now attempt to login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      return { data: null, error };
    }
    
    return { data, error: null };
    
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}


import { supabase } from '@/integrations/supabase/client';
import { ensureUserInDb } from './userProfileService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // Special handling for demo accounts to ensure they always work
    if ((email === 'atalegre@me.com' && password === 'admin123') || 
        (email === 'seoclient@exemplo.com' && password === 'client123')) {
      
      console.log("Demo account login attempt");
      
      // Try to login first
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (existingUser && existingUser.user) {
        console.log("Demo account login successful");
        
        // Ensure user has correct role in database
        const role = email === 'atalegre@me.com' ? 'admin' : 'user';
        const name = email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
        
        await ensureUserInDb(
          existingUser.user.id,
          email,
          name,
          role
        );
        
        return { data: existingUser, error: null };
      }
      
      // If login failed, try to create the account
      console.log("Demo account login failed, creating account");
      
      // Try to create the account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client'
          }
        }
      });
      
      if (signUpError && !signUpError.message.includes("User already registered")) {
        console.error("Error creating demo account:", signUpError);
        return { data: null, error: signUpError };
      }
      
      // Try to login again after account creation
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (loginError) {
        console.error("Login failed after account creation:", loginError);
        return { data: null, error: loginError };
      }
      
      if (loginData && loginData.user) {
        console.log("Login successful after account creation");
        
        // Ensure user has correct role in database
        const role = email === 'atalegre@me.com' ? 'admin' : 'user';
        const name = email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
        
        await ensureUserInDb(
          loginData.user.id,
          email,
          name,
          role
        );
        
        return { data: loginData, error: null };
      }
      
      return { data: null, error: { message: "Failed to authenticate demo account" } };
    }
    
    // Regular login flow for non-demo accounts
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      return { data: null, error };
    }
    
    // Ensure user data exists in database
    if (data?.user) {
      try {
        // Get user metadata
        const fullName = data.user.user_metadata?.full_name || 'User';
        const role = email === 'atalegre@me.com' ? 'admin' : 'user';
        
        await ensureUserInDb(
          data.user.id,
          email,
          fullName,
          role
        );
      } catch (err) {
        console.error("Error ensuring user in database during login:", err);
        // Continue login flow even if this fails
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}


import { supabase } from '@/integrations/supabase/client';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    // Try to log in normally first
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      
      // Special handling for demo accounts when login fails
      if ((email === 'atalegre@me.com' && password === 'admin123') || 
          (email === 'seoclient@exemplo.com' && password === 'client123')) {
        
        console.log("Demo account login failed, attempting to create account first");
        
        // Create a demo account with these credentials
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client'
            }
          }
        });
        
        if (signUpError) {
          console.error("Error creating demo account:", signUpError);
          return { data: null, error: signUpError };
        }
        
        // Try login again
        const secondAttempt = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (secondAttempt.error) {
          console.error("Second login attempt failed:", secondAttempt.error);
          return { data: null, error: secondAttempt.error };
        }
        
        // If login succeeds, ensure proper role in users table
        if (secondAttempt.data.user) {
          const role = email === 'atalegre@me.com' ? 'admin' : 'user';
          const name = email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
          
          try {
            // Create or update user in the database
            await supabase.from('users').upsert([
              {
                id: secondAttempt.data.user.id,
                name: name,
                email: email,
                role: role
              }
            ], { onConflict: 'id' });
            
            console.log(`User record created/updated for ${email} with role ${role}`);
          } catch (dbError) {
            console.error("Error ensuring user in database:", dbError);
            // Continue with the successful login even if database update fails
          }
        }
        
        return secondAttempt;
      }
      
      return { data: null, error };
    }
    
    // Ensure user exists in our database with proper role
    if (data.user) {
      const role = email === 'atalegre@me.com' ? 'admin' : 'user';
      const name = email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
      
      try {
        // Create or update user in the database
        await supabase.from('users').upsert([
          {
            id: data.user.id,
            name: name,
            email: email,
            role: role
          }
        ], { onConflict: 'id' });
        
        console.log(`User record created/updated for ${email} with role ${role}`);
      } catch (dbError) {
        console.error("Error ensuring user in database:", dbError);
        // Continue with the successful login even if database update fails
      }
    }
    
    return { data, error: null };
    
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}

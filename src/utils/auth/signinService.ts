
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
      
      // Special handling for demo accounts
      if ((email === 'atalegre@me.com' && password === 'admin123') || 
          (email === 'seoclient@exemplo.com' && password === 'client123')) {
        
        console.log("Demo account login failed, creating demo account");
        
        // Create the demo account
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client'
            }
          }
        });
        
        if (signUpError) {
          if (!signUpError.message.includes("User already registered")) {
            console.error("Error creating demo account:", signUpError);
            return { data: null, error: signUpError };
          }
        }
        
        // Try login again after account creation
        const secondLoginAttempt = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (secondLoginAttempt.error) {
          console.error("Second login attempt failed:", secondLoginAttempt.error);
          return { data: null, error: secondLoginAttempt.error };
        }
        
        // If login succeeds, ensure proper role in users table
        if (secondLoginAttempt.data.user) {
          try {
            const role = email === 'atalegre@me.com' ? 'admin' : 'user';
            const name = email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
            
            // Check if user exists in users table
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', secondLoginAttempt.data.user.id)
              .single();
              
            if (!existingUser) {
              // Create user record if it doesn't exist
              await supabase.from('users').insert([
                {
                  id: secondLoginAttempt.data.user.id,
                  name: name,
                  email: email,
                  role: role
                }
              ]);
              console.log(`Created user record for ${email} with role ${role}`);
            } else if (existingUser.role !== role) {
              // Update role if needed
              await supabase
                .from('users')
                .update({ role: role })
                .eq('id', secondLoginAttempt.data.user.id);
              console.log(`Updated role for ${email} to ${role}`);
            }
          } catch (dbError) {
            console.error("Database operation failed:", dbError);
            // Continue with login even if database update fails
          }
        }
        
        return secondLoginAttempt;
      }
      
      return { data: null, error };
    }
    
    // Ensure user exists in our database with proper role
    if (data.user) {
      const role = email === 'atalegre@me.com' ? 'admin' : 'user';
      const name = email === 'atalegre@me.com' ? 'Admin User' : 'SEO Client';
      
      try {
        // Check if user exists in users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (!existingUser) {
          // Create user record if it doesn't exist
          await supabase.from('users').insert([
            {
              id: data.user.id,
              name: name,
              email: email,
              role: role
            }
          ]);
          console.log(`Created user record for ${email} with role ${role}`);
        } else if (existingUser.role !== role) {
          // Update role if needed
          await supabase
            .from('users')
            .update({ role: role })
            .eq('id', data.user.id);
          console.log(`Updated role for ${email} to ${role}`);
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        // Continue with login even if database update fails
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception during login:", error);
    return { data: null, error };
  }
}


import { supabase } from '@/integrations/supabase/client';
import { UserWithEmail } from './commonTypes';

const CLIENT_EMAIL = 'seoclient@exemplo.com';
const CLIENT_PASSWORD = 'client123';

/**
 * Creates or updates the default client user
 */
export async function createOrUpdateClient() {
  try {
    console.log("Setting up client user...");
    
    // First try to create the client account in auth
    try {
      console.log("Attempting to create client account");
      
      // Try to sign up the client user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: CLIENT_EMAIL,
        password: CLIENT_PASSWORD,
        options: {
          data: {
            full_name: 'SEO Client',
            role: 'user',
          }
        }
      });
      
      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          console.log("Client account already exists");
        } else {
          console.error("Error creating client user in auth:", signUpError);
        }
      } else {
        console.log("Client account created");
      }
    } catch (error) {
      console.error("Error setting up client auth account:", error);
    }
    
    // Now ensure client exists in users table
    try {
      // Check if client exists in users table
      const { data: existingClientInTable } = await supabase
        .from('users')
        .select('*')
        .eq('email', CLIENT_EMAIL)
        .maybeSingle();
      
      if (!existingClientInTable) {
        // Create new users table entry with the client email
        await supabase.from('users').insert([
          {
            name: 'SEO Client',
            email: CLIENT_EMAIL,
            role: 'user'
          }
        ]);
        console.log("Created client user in users table");
      } else {
        console.log("Client record already exists in users table");
      }
    } catch (error) {
      console.error("Error ensuring client in users table:", error);
    }
  } catch (error) {
    console.error('Error in createOrUpdateClient:', error);
  }
}

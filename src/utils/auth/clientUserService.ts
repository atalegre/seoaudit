
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
      // Check if user already exists first
      const { data } = await supabase.auth.admin.listUsers();
      
      // Safely type and check the users array
      const users = data?.users as UserWithEmail[] | null | undefined;
      const clientExists = users ? users.some(user => user.email === CLIENT_EMAIL) : false;
      
      if (!clientExists) {
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
        
        if (signUpError && !signUpError.message.includes("User already registered")) {
          console.error("Error creating client user in auth:", signUpError);
        } else {
          console.log("Client account created");
        }
      } else {
        console.log("Client account already exists");
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
        // Try to get client auth ID
        const { data } = await supabase.auth.signInWithPassword({
          email: CLIENT_EMAIL,
          password: CLIENT_PASSWORD
        });
        
        if (data?.user) {
          // Create new users table entry
          await supabase.from('users').insert([
            {
              id: data.user.id,
              name: 'SEO Client',
              email: CLIENT_EMAIL,
              role: 'user'
            }
          ]);
          console.log("Created client user in users table");
          
          // Sign out after setup
          await supabase.auth.signOut();
        } else {
          console.log("Could not get client auth user ID");
        }
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

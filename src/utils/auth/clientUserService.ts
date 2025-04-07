
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateRegularUser } from './profileService';

/**
 * Create or update the default client user
 * This function is specifically used for setup/seeding purposes
 */
export async function createOrUpdateClient(
  name: string = 'Test Client',
  email: string = 'client@example.com',
  password: string = 'client123'
): Promise<void> {
  try {
    console.log("Setting up client user:", email);
    
    // Check if client user exists in auth
    const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    });
    
    if (searchError) {
      console.error("Error searching for client user:", searchError);
      // Continue with creation attempt even if search fails
    }
    
    let clientUserId: string | null = null;
    
    // If client exists in auth system
    if (existingUsers?.users && existingUsers.users.length > 0) {
      clientUserId = existingUsers.users[0].id;
      console.log("Client user exists in auth, ID:", clientUserId);
    } else {
      // Create client user in auth system if it doesn't exist
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          role: 'user'
        }
      });
      
      if (error) {
        console.error("Error creating client user in auth:", error);
        return;
      }
      
      if (data?.user) {
        clientUserId = data.user.id;
        console.log("Client user created in auth, ID:", clientUserId);
      }
    }
    
    // If we have a client user ID, ensure they exist in users table
    if (clientUserId) {
      await createOrUpdateRegularUser(clientUserId, email, name, 'user');
      console.log("Client user updated in database");
    }
    
    console.log("Client user setup complete");
  } catch (error) {
    console.error("Error in createOrUpdateClient:", error);
    // Don't throw here as this is a setup function that should not break initialization
  }
}


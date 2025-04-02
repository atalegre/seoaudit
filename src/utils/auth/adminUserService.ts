
import { supabase } from '@/integrations/supabase/client';
import { UserWithEmail } from './commonTypes';

const ADMIN_EMAIL = 'atalegre@me.com';
const ADMIN_PASSWORD = 'admin123';

/**
 * Creates or updates the default admin user
 */
export async function createOrUpdateAdmin() {
  try {
    console.log("Setting up admin user...");
    
    // First try to create the admin account in auth
    try {
      console.log("Attempting to create admin account");
      // Check if user already exists first
      const { data } = await supabase.auth.admin.listUsers();
      
      // Safely type and check the users array
      const users = data?.users as UserWithEmail[] | null | undefined;
      const adminExists = users ? users.some(user => user.email === ADMIN_EMAIL) : false;
      
      if (!adminExists) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          options: {
            data: {
              full_name: 'Admin User',
              role: 'admin',
            }
          }
        });
        
        if (signUpError && !signUpError.message.includes("User already registered")) {
          console.error("Error creating admin user in auth:", signUpError);
        } else {
          console.log("Admin account created");
        }
      } else {
        console.log("Admin account already exists");
      }
    } catch (error) {
      console.error("Error setting up admin auth account:", error);
    }
    
    // Now ensure admin exists in users table
    try {
      // Check if admin exists in users table
      const { data: existingAdminInTable } = await supabase
        .from('users')
        .select('*')
        .eq('email', ADMIN_EMAIL)
        .maybeSingle();
      
      if (!existingAdminInTable) {
        // Try to get admin auth ID
        const { data } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        });
        
        if (data?.user) {
          // Create new users table entry
          await supabase.from('users').insert([
            {
              id: data.user.id,
              name: 'Admin User',
              email: ADMIN_EMAIL,
              role: 'admin'
            }
          ]);
          console.log("Created admin user in users table");
          
          // Sign out after setup
          await supabase.auth.signOut();
        } else {
          console.log("Could not get admin auth user ID");
        }
      } else if (existingAdminInTable.role !== 'admin') {
        // Update role if needed
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('email', ADMIN_EMAIL);
        console.log("Updated admin role in users table");
      } else {
        console.log("Admin record already exists in users table");
      }
    } catch (error) {
      console.error("Error ensuring admin in users table:", error);
    }
  } catch (error) {
    console.error('Error in createOrUpdateAdmin:', error);
  }
}

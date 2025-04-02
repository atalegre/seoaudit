
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
      
      // Try to sign up the admin user
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
      
      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          console.log("Admin account already exists");
        } else {
          console.error("Error creating admin user in auth:", signUpError);
        }
      } else {
        console.log("Admin account created");
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
        // Create new users table entry with the admin email
        await supabase.from('users').insert([
          {
            name: 'Admin User',
            email: ADMIN_EMAIL,
            role: 'admin'
          }
        ]);
        console.log("Created admin user in users table");
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

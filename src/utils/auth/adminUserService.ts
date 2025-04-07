
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
    
    // Get list of all users first to see if admin exists
    try {
      console.log("Checking for existing admin user");
      
      // Check the users table first
      // @ts-ignore - Necessary due to schema type mismatch
      const { data: existingAdmin } = await supabase
        .from('users')
        .select('*')
        .eq('email', ADMIN_EMAIL)
        .maybeSingle();
      
      if (existingAdmin && typeof existingAdmin === 'object' && !('error' in existingAdmin)) {
        console.log("Admin found in users table:", existingAdmin);
        
        // If admin exists but doesn't have admin role, update it
        if (existingAdmin?.role !== 'admin') {
          // @ts-ignore - Necessary due to schema type mismatch
          await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('email', ADMIN_EMAIL);
          console.log("Updated admin role in users table");
        }
      }
    } catch (error) {
      console.error("Error checking for admin in users table:", error);
    }
    
    // Try to create admin auth account
    try {
      // Try to sign in first to check if account exists with these credentials
      const { data: signInResult, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      });
      
      if (signInError || !signInResult?.user) {
        console.log("Admin account doesn't exist or credentials are invalid, creating/updating...");
        
        // Try to create a new admin account
        const { data: signUpResult, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          options: {
            data: {
              full_name: 'Admin User',
              role: 'admin'
            }
          }
        });
        
        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            console.log("Admin account exists but password may be wrong");
          } else {
            console.error("Error creating admin user:", signUpError);
          }
        } else if (signUpResult?.user) {
          console.log("Admin account created successfully");
        }
      } else {
        console.log("Admin account exists and credentials are valid");
      }
    } catch (error) {
      console.error("Error creating admin auth account:", error);
    }
    
    // Ensure admin exists in users table regardless of auth status
    try {
      console.log("Ensuring admin exists in users table");
      
      // Insert or update admin user in users table
      // @ts-ignore - Necessary due to schema type mismatch
      const { error } = await supabase
        .from('users')
        .upsert({
          email: ADMIN_EMAIL,
          name: 'Admin User',
          role: 'admin',
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' });
      
      if (error) {
        console.error("Error upserting admin in users table:", error);
      } else {
        console.log("Admin user successfully created or updated in users table");
      }
    } catch (error) {
      console.error("Error ensuring admin in users table:", error);
    }
  } catch (error) {
    console.error('Error in createOrUpdateAdmin:', error);
  }
}


import { supabase } from '@/integrations/supabase/client';
import { UserRole, SupabaseUser } from './types';

const ADMIN_EMAIL = 'atalegre@me.com';

/**
 * Checks if user is admin
 */
export function isAdminEmail(email: string): boolean {
  return email === ADMIN_EMAIL;
}

/**
 * Handle admin user creation or update
 */
export async function handleAdminUser(userId: string, email: string, name: string): Promise<void> {
  try {
    console.log("Handling admin user creation/update for:", email);
    
    // Use upsert to create or update admin user
    const { error } = await supabase
      .from('users')
      .upsert([{
        id: userId,
        name: name,
        email: email,
        role: 'admin', // Always ensure admin role
        updated_at: new Date().toISOString()
      }], { 
        onConflict: 'id'
      });
    
    if (error) {
      console.error("Error handling admin user:", error);
      
      if (error.code === '23505' && error.message?.includes('users_email_key')) {
        console.log("Admin email exists, updating role for existing record");
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin', name: name, updated_at: new Date().toISOString() })
          .eq('email', email);
          
        if (updateError) {
          console.error("Error updating admin user role:", updateError);
          throw updateError;
        } else {
          console.log("Admin user role updated successfully");
        }
      } else {
        throw error;
      }
    } else {
      console.log("Admin user successfully created or updated");
    }
  } catch (error) {
    console.error("Error in handleAdminUser:", error);
    throw error;
  }
}

/**
 * Create or update the admin user
 * This function is specifically used for setup/seeding purposes
 */
export async function createOrUpdateAdmin(
  name: string = 'Admin User', 
  email: string = ADMIN_EMAIL
): Promise<void> {
  try {
    console.log("Setting up admin user:", email);
    
    // Check if admin user exists in auth
    const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    
    if (searchError) {
      console.error("Error searching for admin user:", searchError);
      // Continue with creation attempt even if search fails
    }
    
    let adminUserId: string | null = null;
    
    // Find the admin user by email
    if (existingUsers?.users) {
      const adminUser = existingUsers.users.find(
        (user: SupabaseUser) => user.email === email
      );
      if (adminUser) {
        adminUserId = adminUser.id;
        console.log("Admin user exists in auth, ID:", adminUserId);
      }
    }
    
    // If admin doesn't exist yet, we don't create it automatically
    // as it requires a password. This will be handled during normal signup.
    if (!adminUserId) {
      console.log("Admin user does not exist in auth yet");
      return;
    }
    
    // If we have an admin user ID, ensure they have admin role in users table
    if (adminUserId) {
      await handleAdminUser(adminUserId, email, name);
    }
    
    console.log("Admin user setup complete");
  } catch (error) {
    console.error("Error in createOrUpdateAdmin:", error);
    // Don't throw here as this is a setup function that should not break initialization
  }
}

/**
 * Sign in or sign up admin user
 */
export async function signInOrSignUpAdmin(email: string, password: string, name: string) {
  console.log('Special handling for admin email:', email);
  
  try {
    // Try to sign in first - if the user exists we'll be able to log in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!signInError && signInData?.user) {
      console.log('Admin exists, successfully signed in');
      
      // Ensure admin role is set in users table
      await handleAdminUser(
        signInData.user.id,
        email,
        name
      );
      
      return { 
        user: signInData.user, 
        session: signInData.session, 
        isNewUser: false
      };
    }
    
    console.log('Admin does not exist or wrong password, trying to create new account');
    
    // Try to create a new admin account
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'admin',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
      },
    });

    if (error) {
      if (error.message?.includes('User already registered')) {
        console.error("Admin exists but password doesn't match:", error);
        throw new Error('Credenciais inválidas para o usuário administrador. Por favor, verifique a senha.');
      }
      
      console.error("Admin SignUp error:", error);
      throw error;
    }
    
    // Create a record in the users table for admin
    if (authData.user) {
      try {
        await handleAdminUser(
          authData.user.id,
          email,
          name
        );
        
        console.log('Admin user record created successfully in database');
      } catch (err) {
        console.error('Error creating admin record in database:', err);
        // Continue with auth flow even if this fails
      }
    }
    
    return { 
      user: authData.user, 
      session: authData.session, 
      isNewUser: true,
      needsEmailVerification: !authData.session
    };
  } catch (error) {
    console.error("Exception during admin registration:", error);
    throw error;
  }
}

// Export only once
export { ADMIN_EMAIL };

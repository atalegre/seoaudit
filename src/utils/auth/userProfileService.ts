
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserProfile } from './types';

/**
 * Checks and returns the role of a user
 */
export async function checkUserRole(userId: string): Promise<UserRole> {
  try {
    // For demo admin email
    const { data: userInfo } = await supabase.auth.getUser();
    if (userInfo?.user?.email === 'atalegre@me.com') {
      return 'admin';
    }
    
    // For other users, check the users table
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
    
    if (data && typeof data === 'object' && 'role' in data) {
      return data.role as UserRole;
    }
    
    return 'user'; // Default to user role
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'user'; // Default to user role if there's an error
  }
}

/**
 * Creates or updates a user record in the database
 */
export async function ensureUserInDb(
  userId: string,
  email: string,
  name: string,
  role: string = 'user'
): Promise<void> {
  try {
    // Special handling for admin account
    if (email === 'atalegre@me.com') {
      role = 'admin';
    }
    
    // Use upsert to create or update user
    const { error } = await supabase
      .from('users')
      .upsert([{
        id: userId,
        name: name,
        email: email,
        role: role,
        updated_at: new Date().toISOString()
      }], { 
        onConflict: 'id'
      });
    
    if (error) {
      // If we got a unique constraint violation on email
      if (error.code === '23505' && error.message?.includes('users_email_key')) {
        console.error("Email already exists:", email);
        
        if (email === 'atalegre@me.com') {
          // For admin email, attempt to update role to admin if record exists
          const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'admin', name: name, updated_at: new Date().toISOString() })
            .eq('email', email);
            
          if (updateError) {
            console.error("Error updating admin user role:", updateError);
          } else {
            console.log("Admin user role updated successfully");
            return; // Successfully updated admin role
          }
        }
        
        throw new Error("Este email já está em uso por outro usuário.");
      } else {
        console.error("Error ensuring user in database:", error);
        throw error;
      }
    }
    
    console.log(`User ${email} successfully created or updated with role ${role}`);
  } catch (error) {
    console.error("Error ensuring user in DB:", error);
    throw error;
  }
}

/**
 * Gets user profile from the database
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Checks if an email already exists in users table
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!email) {
    console.error("No email provided to checkEmailExists");
    return false;
  }
  
  // For the admin email, we want to allow signup attempts
  if (email === 'atalegre@me.com') {
    return false;
  }
  
  try {
    console.log("Checking if email exists:", email);
    
    // Check in the public.users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking email existence:", error);
      return true; // Assume it might exist to prevent duplicate entries
    }
    
    const exists = !!data;
    console.log("Email existence check result:", exists);
    return exists;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return true; // Assume it might exist to prevent duplicate entries
  }
}

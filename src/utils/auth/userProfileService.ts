
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
      // Ensure admin role in database - using RLS this is now handled by trigger
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
    
    // Check if email already exists but with a different user ID
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing user:", checkError);
    }
    
    if (existingUser) {
      console.error("Email already in use by another user:", email);
      throw new Error("Este email já está em uso por outro usuário.");
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
        onConflict: 'id',
        ignoreDuplicates: false
      });
    
    if (error) {
      // Special handling for duplicate email error
      if (error.code === '23505' && error.message?.includes('users_email_key')) {
        console.error("Email already exists:", email);
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
  
  try {
    console.log("Checking if email exists:", email);
    
    // Also check in auth.users to avoid race conditions
    const { data: userData, error: authError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    }).catch(err => {
      console.error("Cannot access auth.users, fallback to only checking public.users", err);
      return { data: null, error: err };
    });
    
    if (userData?.users?.length > 0) {
      console.log("Email exists in auth.users:", email);
      return true;
    }
    
    // Check in the public.users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found
        console.log("Email not found in users table:", email);
        return false;
      }
      console.error("Error checking email existence:", error);
      // In case of error, assume email might exist to prevent duplicate entries
      return true;
    }
    
    const exists = !!data;
    console.log("Email existence check result:", exists);
    return exists;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    // In case of error, assume email might exist to prevent duplicate entries
    return true;
  }
}

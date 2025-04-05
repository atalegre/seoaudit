
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';

/**
 * Checks and returns the role of a user
 */
export async function checkUserRole(userId: string): Promise<UserRole> {
  try {
    // For demo admin email
    const { data: userInfo } = await supabase.auth.getUser();
    if (userInfo?.user?.email === 'atalegre@me.com') {
      // Ensure admin role in database
      await supabase
        .from('users')
        .upsert([
          {
            id: userId,
            name: 'Admin User',
            email: 'atalegre@me.com',
            role: 'admin'
          }
        ], { onConflict: 'id' });
      
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
    
    return (data?.role as UserRole) || 'user';
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
    console.log(`Ensuring user ${email} exists in database with role ${role}`);
    
    // Special handling for admin account
    if (email === 'atalegre@me.com') {
      role = 'admin';
    }
    
    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if user exists:", checkError);
    }
    
    // If user exists but with different email (edge case), update by id
    if (existingUser && existingUser.email !== email) {
      console.log(`User ID exists but email changed from ${existingUser.email} to ${email}`);
    }
    
    // Use upsert to create or update user
    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name: name,
        email: email,
        role: role,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (error) {
      console.error("Error ensuring user in database:", error);
      throw error;
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

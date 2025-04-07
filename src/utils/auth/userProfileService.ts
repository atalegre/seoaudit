
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
        ] as any, { onConflict: 'id' });
      
      return 'admin';
    }
    
    // For other users, check the users table
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId as any)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
    
    return ((data && 'role' in data) ? data.role as UserRole : 'user');
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
      .upsert({
        id: userId,
        name: name,
        email: email,
        role: role,
        updated_at: new Date().toISOString()
      } as any, { onConflict: 'id' });
    
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
      .eq('id', userId as any)
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

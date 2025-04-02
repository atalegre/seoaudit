
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures a user exists in the users table with the given role
 */
export async function ensureUserInDb(
  userId: string, 
  email: string, 
  name: string = 'User', 
  role: 'admin' | 'user' = 'user'
) {
  try {
    // Check if user already exists in the users table
    const { data: userInTable } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (!userInTable) {
      // Create entry in users table
      await supabase.from('users').insert([
        {
          id: userId,
          name: name,
          email: email,
          role: email === 'atalegre@me.com' ? 'admin' : role
        }
      ]);
      console.log(`Created user entry in users table for ${email}`);
      return true;
    } else if (email === 'atalegre@me.com' && userInTable.role !== 'admin') {
      // Ensure this email always has admin role
      await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);
      console.log(`Updated user ${email} to admin role`);
      return true;
    }
    
    return false; // No change needed
  } catch (error) {
    console.error("Error ensuring user in users table:", error);
    return false;
  }
}

/**
 * Ensures the admin user exists in the users table
 */
export async function ensureAdminUserInDb(userId: string, email: string) {
  try {
    const { data: userInTable } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (!userInTable) {
      // Create entry in users table
      await supabase.from('users').insert([
        {
          id: userId,
          name: 'SEO Admin',
          email: email,
          role: 'admin'
        }
      ]);
      console.log("Created admin user entry in users table");
    } else if (userInTable.role !== 'admin') {
      // Ensure role is admin
      await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);
      console.log("Updated user to admin role");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring admin user in DB:", error);
    return false;
  }
}

/**
 * Checks and returns the role of a user
 */
export async function checkUserRole(userId: string): Promise<string> {
  try {
    // Special case for atalegre@me.com
    const { data: userInfo } = await supabase.auth.getUser();
    if (userInfo?.user?.email === 'atalegre@me.com') {
      // Ensure this user is an admin in the users table
      await ensureAdminUserInDb(userId, 'atalegre@me.com');
      return 'admin';
    }
    
    // For other users, check the users table
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
    return data?.role || 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'user'; // Default to user role if there's an error
  }
}

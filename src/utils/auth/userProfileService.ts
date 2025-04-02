
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks and returns the role of a user
 */
export async function checkUserRole(userId: string): Promise<string> {
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
    
    return data?.role || 'user';
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
    // Use upsert to create or update user
    const { error } = await supabase
      .from('users')
      .upsert([
        {
          id: userId,
          name: name,
          email: email,
          role: role
        }
      ], { onConflict: 'id' });
    
    if (error) {
      console.error("Error ensuring user in database:", error);
      throw error;
    }
    
    console.log(`User ${email} created or updated with role ${role}`);
  } catch (error) {
    console.error("Error ensuring user in DB:", error);
    throw error;
  }
}

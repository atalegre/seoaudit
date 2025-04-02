
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
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();
      
    if (queryError) {
      console.error("Error querying user:", queryError);
      return false;
    }
    
    // Ensure admin email always gets admin role
    const finalRole = email === 'atalegre@me.com' ? 'admin' : role;
    
    if (!existingUser) {
      // Create new user record
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          name: name,
          email: email,
          role: finalRole
        }]);
        
      if (insertError) {
        console.error("Error creating user entry:", insertError);
        return false;
      }
      
      console.log(`Created user entry in users table for ${email} with role ${finalRole}`);
      return true;
    } else if (existingUser.role !== finalRole) {
      // Update role if needed
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: finalRole })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error updating user role:", updateError);
        return false;
      }
      
      console.log(`Updated user ${email} to ${finalRole} role`);
      return true;
    }
    
    return true; // User exists with correct role
  } catch (error) {
    console.error("Error ensuring user in users table:", error);
    return false;
  }
}

/**
 * Ensures the admin user exists in the users table
 */
export async function ensureAdminUserInDb(userId: string, email: string) {
  return ensureUserInDb(userId, email, 'SEO Admin', 'admin');
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

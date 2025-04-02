
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks and returns the role of a user
 */
export async function checkUserRole(userId: string): Promise<string> {
  try {
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
    
    // Special handling for admin email
    const { data: userInfo } = await supabase.auth.getUser();
    if (userInfo?.user?.email === 'atalegre@me.com') {
      if (!data || data.role !== 'admin') {
        // Update the role to admin if needed
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', userId);
        return 'admin';
      }
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
    // Check if user exists in the database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking if user exists:", error);
      throw error;
    }
    
    if (!data) {
      // User doesn't exist, insert new record
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            name: name,
            email: email,
            role: role
          }
        ]);
      
      if (insertError) {
        console.error("Error inserting user:", insertError);
        throw insertError;
      }
      
      console.log(`User ${email} created with role ${role}`);
    } else {
      // User exists, update if needed
      if (data.role !== role || data.name !== name) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: name,
            role: role
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error("Error updating user:", updateError);
          throw updateError;
        }
        
        console.log(`User ${email} updated with role ${role}`);
      }
    }
  } catch (error) {
    console.error("Error ensuring user in DB:", error);
    throw error;
  }
}

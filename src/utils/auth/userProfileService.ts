
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

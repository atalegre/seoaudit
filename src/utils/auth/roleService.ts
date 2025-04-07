
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';
import { isAdminEmail } from './adminUserService';

/**
 * Checks and returns the role of a user
 */
export async function checkUserRole(userId: string): Promise<UserRole> {
  try {
    // For demo admin email
    const { data: userInfo } = await supabase.auth.getUser();
    if (userInfo?.user?.email && isAdminEmail(userInfo.user.email)) {
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


import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserProfile } from './types';
import { handleAdminUser, isAdminEmail } from './adminUserService';

/**
 * Creates or updates a regular (non-admin) user record in the database
 */
export async function createOrUpdateRegularUser(
  userId: string,
  email: string,
  name: string,
  role: string = 'user'
): Promise<void> {
  try {
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
        throw new Error("Este email já está em uso por outro usuário.");
      } else {
        console.error("Error creating/updating user in database:", error);
        throw error;
      }
    }
    
    console.log(`User ${email} successfully created or updated with role ${role}`);
  } catch (error) {
    console.error("Error in createOrUpdateRegularUser:", error);
    throw error;
  }
}

/**
 * Creates or updates a user record in the database
 * This is the main entry point that decides between admin and regular users
 */
export async function ensureUserInDb(
  userId: string,
  email: string,
  name: string,
  role: string = 'user'
): Promise<void> {
  try {
    // Special handling for admin account
    if (isAdminEmail(email)) {
      await handleAdminUser(userId, email, name);
      return;
    }
    
    // For regular users
    await createOrUpdateRegularUser(userId, email, name, role);
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

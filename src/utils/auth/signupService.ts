
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from './types';
import { ensureUserInDb } from './userProfileService';

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;

  // Check if user already exists
  const { data: existingUsers } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (existingUsers && existingUsers.length > 0) {
    console.log("User already exists in users table:", existingUsers);
  }

  // Try normal registration
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: role, // Add role to user metadata
      },
    },
  });

  if (error) {
    console.error("SignUp error:", error);
    throw error;
  }
  
  // Create a record in the users table
  if (authData.user) {
    try {
      await ensureUserInDb(
        authData.user.id,
        email,
        name,
        email === 'atalegre@me.com' ? 'admin' : role
      );
    } catch (err) {
      console.error('Error creating user record:', err);
      // Continue with auth flow even if this fails
    }
  }
  
  // Store email for verification
  localStorage.setItem('pendingVerificationEmail', email);

  return authData;
}

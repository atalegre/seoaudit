
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from './types';
import { ensureUserInDb } from './profileService';
import { isAdminEmail, signInOrSignUpAdmin } from './adminUserService';
import { checkEmailExists } from './emailValidationService';

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;
  
  console.log('Starting signup process for:', email);

  // Check if email already exists
  const emailExists = await checkEmailExists(email);
  if (emailExists && !isAdminEmail(email)) {
    throw new Error('Este email já está registrado. Por favor, faça login.');
  }

  // Special handling for admin email
  if (isAdminEmail(email)) {
    return signInOrSignUpAdmin(email, password, name);
  }
  
  // For non-admin users, normal signup flow
  try {
    // Create new user in auth
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/client`
      },
    });

    if (error) {
      console.error("SignUp error:", error);
      
      // Handle specific error for user already existing in auth
      if (error.message?.includes('User already registered')) {
        throw new Error('Este email já está registrado. Por favor, faça login.');
      }
      
      throw error;
    }
    
    // Create a record in the users table
    if (authData.user) {
      console.log('Auth user created, now creating user record in database');
      
      try {
        await ensureUserInDb(
          authData.user.id,
          email,
          name,
          role
        );
        
        console.log('User record created successfully in database');
      } catch (err) {
        console.error('Error creating user record in database:', err);
        // Continue with auth flow even if this fails
      }
    }
    
    // Store email for verification if needed
    if (!authData.session) {
      localStorage.setItem('pendingVerificationEmail', email);
    }

    return { 
      user: authData.user, 
      session: authData.session, 
      isNewUser: true,
      needsEmailVerification: !authData.session
    };
  } catch (error) {
    console.error("Exception during registration:", error);
    throw error;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { SignUpData, AuthResult } from './types';
import { createUserProfile } from './profileService';
import { isAdminEmail, signInOrSignUpAdmin } from './adminUserService';

/**
 * Checks if an email already exists in users table
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!email) {
    console.error("No email provided to checkEmailExists");
    return false;
  }
  
  // For the admin email, we want to allow signup attempts
  if (isAdminEmail(email)) {
    return false;
  }
  
  try {
    console.log("Checking if email exists:", email);
    
    // Check in the public.users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking email existence:", error);
      return true; // Assume it might exist to prevent duplicate entries
    }
    
    const exists = !!data;
    console.log("Email existence check result:", exists);
    return exists;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return true; // Assume it might exist to prevent duplicate entries
  }
}

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
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
      
      if (error.message?.includes('User already registered')) {
        throw new Error('Este email já está registrado. Por favor, faça login.');
      }
      
      throw error;
    }
    
    // Create a record in the users table
    if (authData.user) {
      console.log('Auth user created, now creating user record in database');
      
      try {
        await createUserProfile(
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

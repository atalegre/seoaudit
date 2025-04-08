
import { supabase } from '@/integrations/supabase/client';
import { SignUpData, AuthResult } from './types';
import { createUserProfile } from './profileService';
import { isAdminEmail, signInOrSignUpAdmin } from './adminUserService';
import { checkEmailExists } from './emailValidationService';
import { sendVerificationEmail } from './emailVerificationService';

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  const { name, email, password, role = 'user' } = data;
  
  console.log('Starting signup process for:', email);
  console.log('Signup data:', { name, email, role });

  // Check if email already exists
  const emailExists = await checkEmailExists(email);
  if (emailExists && !isAdminEmail(email)) {
    console.log('Email already exists, cannot proceed with signup:', email);
    throw new Error('Este email já está registrado. Por favor, faça login.');
  }

  // Special handling for admin email
  if (isAdminEmail(email)) {
    console.log('Admin email detected, using special signup handling');
    return signInOrSignUpAdmin(email, password, name);
  }
  
  // For non-admin users, normal signup flow
  try {
    console.log('Creating new user in auth system');
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
      
      // Send verification email automatically after signup
      try {
        const emailSent = await sendVerificationEmail(email, name);
        console.log('Verification email sent during signup:', emailSent);
        // Continue anyway, verification page will show appropriate message
      } catch (emailErr) {
        console.error('Error sending verification email during signup:', emailErr);
        // Continue with signup flow even if email sending fails
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

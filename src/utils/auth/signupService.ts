
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
 * Envia email de verificação para um usuário recém registrado
 */
export async function sendVerificationEmail(email: string, name?: string): Promise<boolean> {
  try {
    console.log('Sending verification email to:', email);
    
    // Create confirmation URL
    const confirmationUrl = `${window.location.origin}/auth/callback?next=/dashboard/client`;
    console.log('Using confirmation URL:', confirmationUrl);
    
    // Tente enviar pelo edge function primeiro
    try {
      const functionResponse = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          email,
          name: name || 'Utilizador',
          confirmationUrl
        }
      });
      
      if (functionResponse.error) {
        throw new Error(`Custom email error: ${JSON.stringify(functionResponse.error)}`);
      }
      
      console.log('Custom verification email sent successfully via function');
      return true;
    } catch (customErr) {
      console.error('Error sending custom verification email:', customErr);
      // Continue with standard method as fallback
    }
    
    // Fallback para o método padrão do Supabase
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: confirmationUrl
      }
    });
    
    if (error) {
      console.error('Error sending standard verification email:', error);
      return false;
    }
    
    console.log('Standard verification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    return false;
  }
}

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
      
      // Enviar email de verificação automaticamente após o cadastro
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

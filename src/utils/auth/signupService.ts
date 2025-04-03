
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from './types';
import { ensureUserInDb } from './userProfileService';

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;
  
  console.log('Starting signup process for:', email);

  // Check if user already exists in auth
  const { data: existingUser } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (existingUser?.user) {
    console.log('User already exists in auth system:', existingUser.user.email);
    return { user: existingUser.user, session: existingUser.session, isNewUser: false };
  }

  console.log('Creating new user in auth system');
  
  // Create new user in auth
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: email === 'atalegre@me.com' ? 'admin' : role,
      },
      // Send a custom email using our edge function
      emailRedirectTo: `${window.location.origin}/verification`,
    },
  });

  if (error) {
    console.error("SignUp error:", error);
    throw error;
  }
  
  // Create a record in the users table
  if (authData.user) {
    console.log('Auth user created, now creating user record in database');
    
    try {
      const userRole = email === 'atalegre@me.com' ? 'admin' : role;
      
      await ensureUserInDb(
        authData.user.id,
        email,
        name,
        userRole
      );
      
      console.log('User record created successfully in database');
    } catch (err) {
      console.error('Error creating user record in database:', err);
      // We continue with auth flow even if this fails
    }

    // Always try both methods to send verification email
    // 1. First try our custom email function
    try {
      console.log('Sending custom verification email');
      const confirmationUrl = `${window.location.origin}/verification?email=${encodeURIComponent(email)}`;
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          email,
          name,
          confirmationUrl
        }
      });
      
      console.log('Custom email function response:', response);
    } catch (err) {
      console.error('Error sending custom verification email:', err);
      // Continue with default Supabase email as fallback
    }

    // 2. Try to resend using standard Supabase method as well (belt and suspenders approach)
    try {
      console.log('Sending standard Supabase verification email');
      await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verification?email=${encodeURIComponent(email)}`
        }
      });
      console.log('Standard verification email sent successfully');
    } catch (err) {
      console.error('Error sending standard verification email:', err);
      // Continue with auth flow even if this fails
    }
  }
  
  // Store email for verification (if needed)
  localStorage.setItem('pendingVerificationEmail', email);

  return { user: authData.user, session: authData.session, isNewUser: true };
}

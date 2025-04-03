
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

    // Try multiple methods to send verification emails for redundancy
    const confirmationUrl = `${window.location.origin}/verification?email=${encodeURIComponent(email)}`;
    const methods = [
      // Method 1: Send via custom edge function
      async () => {
        try {
          console.log('Sending custom verification email via edge function');
          const response = await supabase.functions.invoke('send-email', {
            body: {
              type: 'confirmation',
              email,
              name,
              confirmationUrl
            }
          });
          console.log('Custom email function response:', response);
          return true;
        } catch (err) {
          console.error('Error sending custom verification email:', err);
          return false;
        }
      },
      
      // Method 2: Use Supabase's built-in email
      async () => {
        try {
          console.log('Sending standard Supabase verification email');
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
              emailRedirectTo: confirmationUrl
            }
          });
          if (error) {
            console.error('Error in Supabase email resend:', error);
            return false;
          }
          console.log('Standard verification email sent successfully');
          return true;
        } catch (err) {
          console.error('Error sending standard verification email:', err);
          return false;
        }
      }
    ];
    
    // Try all methods sequentially until one works
    for (const method of methods) {
      try {
        const success = await method();
        if (success) {
          console.log('Successfully sent verification email using one of the methods');
          break;
        }
      } catch (error) {
        console.error('Method failed:', error);
        // Continue to the next method
      }
    }
  }
  
  // Store email for verification
  localStorage.setItem('pendingVerificationEmail', email);

  return { user: authData.user, session: authData.session, isNewUser: true };
}

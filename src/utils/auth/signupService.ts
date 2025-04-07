
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from './types';
import { ensureUserInDb } from './userProfileService';
import { checkEmailExists } from './userProfileService';

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;
  
  console.log('Starting signup process for:', email);

  try {
    // Check if the email already exists in the users table before attempting signup
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      console.log('Email already exists in users table:', email);
      throw new Error('Este email já está em uso por outro usuário.');
    }
    
    // Create new user in auth
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: email === 'atalegre@me.com' ? 'admin' : role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/client`
      },
    });

    if (error) {
      console.error("SignUp error:", error);
      
      // Handle specific error for user already existing in auth but not in users table
      if (error.message?.includes('User already registered')) {
        console.log('User exists in auth but might not exist in users table');
        throw new Error('Este email já está registrado. Por favor, faça login.');
      }
      
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
        
        // Try sending confirmation email via our custom function
        try {
          console.log('Preparing to send custom confirmation email via function');
          
          const confirmationUrl = `${window.location.origin}/auth/callback?next=/dashboard/client`;
          console.log('Confirmation URL:', confirmationUrl);
          
          const response = await supabase.functions.invoke('send-email', {
            body: {
              type: 'confirmation',
              email,
              name,
              confirmationUrl
            }
          });
          
          console.log('Custom confirmation email function response:', response);
          
          if (response.error) {
            console.error('Error from email function:', response.error);
            throw new Error(`Email function error: ${response.error}`);
          }
          
          console.log('Custom confirmation email sent successfully');
        } catch (err) {
          console.error('Error sending custom confirmation email:', err);
          // Continue with auth flow even if this fails
        }
      } catch (err) {
        console.error('Error creating user record in database:', err);
        // We continue with auth flow even if this fails
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

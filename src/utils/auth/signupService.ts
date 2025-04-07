
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from './types';
import { ensureUserInDb } from './userProfileService';

/**
 * Handles user signup with email
 */
export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;
  
  console.log('Starting signup process for:', email);

  // Special handling for admin email
  if (email === 'atalegre@me.com') {
    console.log('Admin email detected - special handling for:', email);
    
    try {
      // Try to sign in first - if the user exists we'll be able to log in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!signInError && signInData?.user) {
        console.log('Admin exists, successfully signed in');
        
        // Ensure admin role is set in users table
        await ensureUserInDb(
          signInData.user.id,
          email,
          name,
          'admin'
        );
        
        return { 
          user: signInData.user, 
          session: signInData.session, 
          isNewUser: false
        };
      }
      
      console.log('Admin does not exist or wrong password, trying to create new account');
      
      // Try to create a new admin account
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'admin',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
        },
      });

      if (error) {
        // If user exists but password doesn't match
        if (error.message?.includes('User already registered')) {
          console.error("Admin exists but password doesn't match:", error);
          throw new Error('Credenciais inválidas para o usuário administrador. Por favor, verifique a senha.');
        }
        
        console.error("Admin SignUp error:", error);
        throw error;
      }
      
      // Create a record in the users table for admin
      if (authData.user) {
        try {
          await ensureUserInDb(
            authData.user.id,
            email,
            name,
            'admin'
          );
          
          console.log('Admin user record created successfully in database');
        } catch (err) {
          console.error('Error creating admin record in database:', err);
          // Continue with auth flow even if this fails
        }
      }
      
      return { 
        user: authData.user, 
        session: authData.session, 
        isNewUser: true,
        needsEmailVerification: !authData.session
      };
    } catch (error) {
      console.error("Exception during admin registration:", error);
      throw error;
    }
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

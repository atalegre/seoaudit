
import { supabase } from '@/integrations/supabase/client';

export type SignUpData = {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  role?: 'admin' | 'editor' | 'user';
};

export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;

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
    throw error;
  }
  
  // Create a record in the users table
  if (authData.user) {
    try {
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: authData.user.id,
            name: name,
            email: email,
            role: role
          }
        ]);
        
      if (userError) throw userError;
    } catch (err) {
      console.error('Error creating user record:', err);
      // Continue with auth flow even if this fails
    }
  }
  
  // Store email for verification
  localStorage.setItem('pendingVerificationEmail', email);

  return authData;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
}

// Check if user is admin
export async function checkUserRole(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.role || 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'user'; // Default to user role if there's an error
  }
}

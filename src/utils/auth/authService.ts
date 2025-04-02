
import { supabase } from '@/integrations/supabase/client';
import { createDefaultUsers } from './createDefaultUsers';

export type SignUpData = {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  role?: 'admin' | 'editor' | 'user';
};

export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password, role = 'user' } = data;

  // Verificar se o usuário já existe
  const { data: existingUsers } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (existingUsers && existingUsers.length > 0) {
    console.log("User already exists in users table:", existingUsers);
  }

  // Tentar registro normal
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
      // Verificar se já existe na tabela users
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (existingUser) {
        console.log("User already exists in users table with ID:", existingUser);
      } else {
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
          
        if (userError) {
          console.error("Error creating user record:", userError);
          if (userError.message.includes("duplicate key")) {
            console.log("User already exists in users table (duplicate key)");
          }
        }
      }
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
  // Create default users if they don't exist (for demo purposes)
  try {
    await createDefaultUsers();
  } catch (error) {
    console.error("Error creating default users:", error);
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("SignIn error:", error);
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
    
    if (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
    return data?.role || 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'user'; // Default to user role if there's an error
  }
}

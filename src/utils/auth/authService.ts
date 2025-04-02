
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
  // Create default users if they don't exist (for demo purposes)
  await createDefaultUsers();
  
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

// Function to create default admin and client users if they don't exist
async function createDefaultUsers() {
  try {
    // Check if admin user exists
    const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
      email: 'seoadmin@exemplo.com',
      password: 'admin',
    });

    // If admin doesn't exist, create it
    if (adminError && adminError.message.includes('Invalid login credentials')) {
      const { data: newAdmin, error: createError } = await supabase.auth.signUp({
        email: 'seoadmin@exemplo.com',
        password: 'admin',
        options: {
          data: {
            full_name: 'Admin User',
            role: 'admin',
          },
        },
      });
      
      if (newAdmin.user) {
        await supabase.from('users').insert([{
          id: newAdmin.user.id,
          name: 'Admin User',
          email: 'seoadmin@exemplo.com',
          role: 'admin'
        }]);
      }
    }

    // Check if client user exists
    const { data: clientData, error: clientError } = await supabase.auth.signInWithPassword({
      email: 'seoclient@exemplo.com',
      password: 'client',
    });

    // If client doesn't exist, create it
    if (clientError && clientError.message.includes('Invalid login credentials')) {
      const { data: newClient, error: createError } = await supabase.auth.signUp({
        email: 'seoclient@exemplo.com',
        password: 'client',
        options: {
          data: {
            full_name: 'Client User',
            role: 'user',
          },
        },
      });
      
      if (newClient.user) {
        await supabase.from('users').insert([{
          id: newClient.user.id,
          name: 'Client User',
          email: 'seoclient@exemplo.com',
          role: 'user'
        }]);
      }
    }
  } catch (error) {
    console.error('Error creating default users:', error);
  }
}

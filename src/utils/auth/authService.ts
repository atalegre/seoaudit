
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
    // Use admin key to insert users directly
    const adminApiKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Check if admin user exists
    const { data: adminExists } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'seoadmin@exemplo.com')
      .maybeSingle();

    // If admin doesn't exist, create it
    if (!adminExists) {
      console.log("Creating admin user");
      
      // Create a new user with no email verification
      const { data, error } = await supabase.auth.signUp({
        email: 'seoadmin@exemplo.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'Admin User',
            role: 'admin',
          },
          // This won't bypass email confirmation in standard auth flow
        },
      });
      
      if (error) {
        console.error("Error creating admin user:", error);
      } else if (data.user) {
        // Create a record in the users table
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            name: 'Admin User',
            email: 'seoadmin@exemplo.com',
            role: 'admin'
          }]);
      }
    }

    // Check if client user exists
    const { data: clientExists } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'seoclient@exemplo.com')
      .maybeSingle();

    // If client doesn't exist, create it
    if (!clientExists) {
      console.log("Creating client user");
      
      const { data, error } = await supabase.auth.signUp({
        email: 'seoclient@exemplo.com',
        password: 'client123',
        options: {
          data: {
            full_name: 'Client User',
            role: 'user',
          },
          // This won't bypass email confirmation in standard auth flow
        },
      });
      
      if (error) {
        console.error("Error creating client user:", error);
      } else if (data.user) {
        // Create a record in the users table
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
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

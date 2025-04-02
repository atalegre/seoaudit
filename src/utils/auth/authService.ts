
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

  // Check if user already exists
  const { data: existingUsers } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (existingUsers && existingUsers.length > 0) {
    console.log("User already exists in users table:", existingUsers);
  }

  // Try normal registration
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
      // Check if exists in users table
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
              role: email === 'atalegre@me.com' ? 'admin' : role // Always make this email admin
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
  console.log("Attempting to sign in with email:", email);
  
  // First try to sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("SignIn error:", error);
    
    // If the email is atalegre@me.com but password is wrong, we might need to create or update the user
    if (email === 'atalegre@me.com') {
      console.log("Attempting to create or update admin user");
      try {
        // First check if this email exists in auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'SEO Admin',
              role: 'admin',
            },
          },
        });
        
        if (signUpError) {
          console.error("Error creating admin user:", signUpError);
          throw error; // Throw the original error
        }
        
        if (signUpData.user) {
          // Create users entry
          await supabase.from('users').insert([
            { 
              id: signUpData.user.id,
              name: 'SEO Admin',
              email: email,
              role: 'admin'
            }
          ]);
          
          console.log("Created new admin user");
          
          // Now try to sign in again
          return await supabase.auth.signInWithPassword({
            email,
            password,
          });
        }
      } catch (e) {
        console.error("Error in admin user setup:", e);
      }
    }
    
    throw error;
  }

  // Try to ensure the user exists in the users table
  if (data.user) {
    try {
      const { data: userInTable } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (!userInTable) {
        // Create entry in users table
        await supabase.from('users').insert([
          {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || 'User',
            email: data.user.email || '',
            role: data.user.email === 'atalegre@me.com' ? 'admin' : 'user'
          }
        ]);
        console.log("Created user entry in users table");
      } else if (data.user.email === 'atalegre@me.com' && userInTable.role !== 'admin') {
        // Ensure this email always has admin role
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
        console.log("Updated user to admin role");
      }
    } catch (err) {
      console.error("Error ensuring user in users table:", err);
    }
  }

  return { data, error: null };
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
    // Special case for atalegre@me.com
    const { data: userInfo } = await supabase.auth.getUser();
    if (userInfo?.user?.email === 'atalegre@me.com') {
      // Ensure this user is an admin in the users table
      const { data: userInTable } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (!userInTable) {
        // Create entry for this user
        await supabase.from('users').insert([
          {
            id: userId,
            name: userInfo.user.user_metadata?.full_name || 'SEO Admin',
            email: 'atalegre@me.com',
            role: 'admin'
          }
        ]);
      } else if (userInTable.role !== 'admin') {
        // Update role to admin
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', userId);
      }
      
      return 'admin';
    }
    
    // For other users, check the users table
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

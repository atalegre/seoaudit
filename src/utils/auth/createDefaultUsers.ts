
import { supabase } from '@/integrations/supabase/client';

// Function to create default admin and client users if they don't exist
export async function createDefaultUsers() {
  try {
    console.log("Creating default users...");
    
    // Try to create admin user
    await createOrUpdateUser({
      email: 'atalegre@me.com',
      password: 'admin123',
      name: 'SEO Admin',
      role: 'admin'
    });
    
    // Try to create client user
    await createOrUpdateUser({
      email: 'seoclient@exemplo.com',
      password: 'client123',
      name: 'SEO Client',
      role: 'user'
    });
    
    console.log('Default users setup complete');
  } catch (error) {
    console.error('Error creating default users:', error);
    // Continue with auth flow even if this fails
  }
}

async function createOrUpdateUser({ email, password, name, role }: { 
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  // First check if user exists in auth
  const { data: userData } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  }).catch(() => ({ data: null }));
  
  if (userData?.user) {
    // User exists with correct password
    console.log(`User ${email} already exists with correct password`);
    
    // Ensure user exists in users table too
    await ensureUserInUsersTable(userData.user.id, name, email, role);
    return;
  }
  
  // Check if user exists in auth by email
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
    
  if (existingUser) {
    console.log(`User ${email} exists in users table, updating auth if needed`);
    
    // Try to update password (this might fail if user doesn't exist in auth)
    try {
      // This will fail if user doesn't exist in auth
      const { error } = await supabase.auth.admin.updateUserById(
        existingUser.id, 
        { password: password }
      );
      
      if (error) {
        console.log(`Failed to update password for ${email}, will try creating`);
      } else {
        return;
      }
    } catch (e) {
      console.log(`Error updating user, will try creating: ${e}`);
    }
  }
  
  // Create new user in auth
  console.log(`Creating user ${email} in auth`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: name,
        role: role,
      },
    }
  });
  
  if (authError) {
    // If user already exists, this might fail, but that's okay
    if (authError.message?.includes("User already registered")) {
      console.log(`User ${email} already exists in auth`);
    } else {
      console.error(`Error creating ${email} in auth:`, authError);
      throw authError;
    }
  } else if (authData?.user) {
    console.log(`Created ${email} in auth with ID: ${authData.user.id}`);
    
    // Create users table entry
    await ensureUserInUsersTable(authData.user.id, name, email, role);
  }
}

async function ensureUserInUsersTable(userId: string, name: string, email: string, role: string) {
  // Check if already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (existingUser) {
    console.log(`User ${email} already exists in users table`);
    return;
  }
  
  // Insert if not exists
  const { error: userError } = await supabase
    .from('users')
    .insert([{ 
      id: userId,
      name: name,
      email: email,
      role: role
    }]);
    
  if (userError) {
    if (userError.message.includes("duplicate key")) {
      console.log(`User ${email} already exists in users table (duplicate key)`);
    } else {
      console.error(`Error creating user record for ${email}:`, userError);
      throw userError;
    }
  } else {
    console.log(`Created ${email} in users table`);
  }
}

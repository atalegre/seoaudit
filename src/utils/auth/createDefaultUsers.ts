
import { supabase } from '@/integrations/supabase/client';

// Function to create default admin and client users if they don't exist
export async function createDefaultUsers() {
  try {
    console.log("Setting up default users...");
    
    // Create admin user
    await createOrUpdateAdmin();
    
    // Create client user
    await createOrUpdateClient();
    
    console.log('Default users setup complete');
  } catch (error) {
    console.error('Error in createDefaultUsers:', error);
  }
}

// Helper function for creating/updating admin user
export async function createOrUpdateAdmin() {
  try {
    console.log("Setting up admin user...");
    
    const adminEmail = 'atalegre@me.com';
    const adminPassword = 'admin123';
    
    // Check if admin exists in users table
    const { data: existingAdminInTable } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle();
    
    // Try to find or create the admin in auth
    try {
      // First try to sign in - if this works, the user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (!signInError && signInData.user) {
        console.log("Admin exists in auth and password is correct");
        
        // Make sure they're in the users table with admin role
        if (existingAdminInTable) {
          if (existingAdminInTable.role !== 'admin') {
            await supabase
              .from('users')
              .update({ role: 'admin' })
              .eq('id', signInData.user.id);
            console.log("Updated admin user role");
          }
        } else {
          // Create new users table entry
          await supabase.from('users').insert([
            {
              id: signInData.user.id,
              name: 'SEO Admin',
              email: adminEmail,
              role: 'admin'
            }
          ]);
          console.log("Created admin user in users table");
        }
        
        // Important: sign out again to not interfere with the user's session
        await supabase.auth.signOut();
        
      } else {
        console.log("Admin sign-in failed, trying to create admin user");
        
        // Create admin user via signUp
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              full_name: 'SEO Admin',
              role: 'admin',
            }
          }
        });
        
        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            console.log("Admin user already exists in auth, but with different password");
          } else {
            console.error("Error creating admin user:", signUpError);
          }
        } else if (signUpData.user) {
          console.log("Created admin user in auth");
          
          // Create users table entry
          if (!existingAdminInTable) {
            await supabase.from('users').insert([
              {
                id: signUpData.user.id,
                name: 'SEO Admin',
                email: adminEmail,
                role: 'admin'
              }
            ]);
            console.log("Created admin user in users table");
          }
        }
      }
    } catch (error) {
      console.error("Error setting up admin user:", error);
    }
  } catch (error) {
    console.error('Error in createOrUpdateAdmin:', error);
  }
}

// Helper function for creating/updating client user
export async function createOrUpdateClient() {
  try {
    console.log("Setting up client user...");
    
    const clientEmail = 'seoclient@exemplo.com';
    const clientPassword = 'client123';
    
    // Check if client exists in users table
    const { data: existingClientInTable } = await supabase
      .from('users')
      .select('*')
      .eq('email', clientEmail)
      .maybeSingle();
      
    if (!existingClientInTable) {
      // Try to create client user in auth
      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: clientEmail,
          password: clientPassword,
          options: {
            data: {
              full_name: 'SEO Client',
              role: 'user',
            }
          }
        });
        
        if (signUpError && !signUpError.message.includes("already registered")) {
          console.error("Error creating client user:", signUpError);
        } else if (signUpData.user) {
          console.log("Created client user in auth");
          
          // Create users table entry
          await supabase.from('users').insert([
            {
              id: signUpData.user.id,
              name: 'SEO Client',
              email: clientEmail,
              role: 'user'
            }
          ]);
          console.log("Created client user in users table");
        }
      } catch (error) {
        console.error("Error setting up client user:", error);
      }
    }
  } catch (error) {
    console.error('Error in createOrUpdateClient:', error);
  }
}

// Helper function for manually ensuring a user has admin privileges
export async function ensureAdminUser(userId: string, email: string) {
  try {
    // Check if user exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (existingUser) {
      // Update role to admin if needed
      if (existingUser.role !== 'admin') {
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', userId);
        console.log(`User ${email} updated to admin role`);
      }
    } else {
      // Create new entry in users table
      await supabase
        .from('users')
        .insert([
          { 
            id: userId,
            name: 'SEO Admin',
            email: email,
            role: 'admin'
          }
        ]);
      console.log(`User ${email} added to users table with admin role`);
    }
    return true;
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return false;
  }
}

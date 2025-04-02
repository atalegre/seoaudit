
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

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
    
    // First try to create the admin account in auth
    try {
      console.log("Attempting to create admin account");
      // Check if user already exists first
      const { data } = await supabase.auth.admin.listUsers();
      
      // Properly type and check users
      const users = data?.users as User[] | undefined;
      const adminExists = users ? users.some(user => user.email === adminEmail) : false;
      
      if (!adminExists) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              full_name: 'Admin User',
              role: 'admin',
            }
          }
        });
        
        if (signUpError && !signUpError.message.includes("User already registered")) {
          console.error("Error creating admin user in auth:", signUpError);
        } else {
          console.log("Admin account created");
        }
      } else {
        console.log("Admin account already exists");
      }
    } catch (error) {
      console.error("Error setting up admin auth account:", error);
    }
    
    // Now ensure admin exists in users table
    try {
      // Check if admin exists in users table
      const { data: existingAdminInTable } = await supabase
        .from('users')
        .select('*')
        .eq('email', adminEmail)
        .maybeSingle();
      
      if (!existingAdminInTable) {
        // Try to get admin auth ID
        const { data } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });
        
        if (data?.user) {
          // Create new users table entry
          await supabase.from('users').insert([
            {
              id: data.user.id,
              name: 'Admin User',
              email: adminEmail,
              role: 'admin'
            }
          ]);
          console.log("Created admin user in users table");
          
          // Sign out after setup
          await supabase.auth.signOut();
        } else {
          console.log("Could not get admin auth user ID");
        }
      } else if (existingAdminInTable.role !== 'admin') {
        // Update role if needed
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('email', adminEmail);
        console.log("Updated admin role in users table");
      } else {
        console.log("Admin record already exists in users table");
      }
    } catch (error) {
      console.error("Error ensuring admin in users table:", error);
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
    
    // First try to create the client account in auth
    try {
      console.log("Attempting to create client account");
      // Check if user already exists first
      const { data } = await supabase.auth.admin.listUsers();
      
      // Properly type and check users
      const users = data?.users as User[] | undefined;
      const clientExists = users ? users.some(user => user.email === clientEmail) : false;
      
      if (!clientExists) {
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
        
        if (signUpError && !signUpError.message.includes("User already registered")) {
          console.error("Error creating client user in auth:", signUpError);
        } else {
          console.log("Client account created");
        }
      } else {
        console.log("Client account already exists");
      }
    } catch (error) {
      console.error("Error setting up client auth account:", error);
    }
    
    // Now ensure client exists in users table
    try {
      // Check if client exists in users table
      const { data: existingClientInTable } = await supabase
        .from('users')
        .select('*')
        .eq('email', clientEmail)
        .maybeSingle();
      
      if (!existingClientInTable) {
        // Try to get client auth ID
        const { data } = await supabase.auth.signInWithPassword({
          email: clientEmail,
          password: clientPassword
        });
        
        if (data?.user) {
          // Create new users table entry
          await supabase.from('users').insert([
            {
              id: data.user.id,
              name: 'SEO Client',
              email: clientEmail,
              role: 'user'
            }
          ]);
          console.log("Created client user in users table");
          
          // Sign out after setup
          await supabase.auth.signOut();
        } else {
          console.log("Could not get client auth user ID");
        }
      } else {
        console.log("Client record already exists in users table");
      }
    } catch (error) {
      console.error("Error ensuring client in users table:", error);
    }
  } catch (error) {
    console.error('Error in createOrUpdateClient:', error);
  }
}


import { supabase } from '@/integrations/supabase/client';

// Function to create default admin and client users if they don't exist
export async function createDefaultUsers() {
  try {
    console.log("Creating default users...");
    
    // Check if admin user exists in users table
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'atalegre@me.com')
      .maybeSingle();

    if (adminError) {
      console.error("Error checking admin user:", adminError);
      throw adminError;
    }

    // Create admin user if not exists
    if (!adminData) {
      console.log('Creating admin user');
      
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'atalegre@me.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'SEO Admin',
            role: 'admin',
          },
        }
      });

      if (authError) {
        console.error("Error creating admin auth:", authError);
        if (authError.message.includes("User already registered")) {
          console.log("Admin already exists in auth");
        } else {
          throw authError;
        }
      } else if (authData.user) {
        console.log("Admin auth user created:", authData.user.id);
        
        // Then create users table entry
        const { error: userError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              name: 'SEO Admin',
              email: 'atalegre@me.com',
              role: 'admin'
            }
          ]);
          
        if (userError) {
          console.error("Error creating admin user:", userError);
          if (userError.message.includes("duplicate key")) {
            console.log("Admin already exists in users table (duplicate key)");
          } else {
            throw userError;
          }
        } else {
          console.log("Admin user created successfully");
        }
      }
    } else {
      console.log("Admin user already exists:", adminData);
    }

    // Check if client user exists
    const { data: clientData, error: clientError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'seoclient@exemplo.com')
      .maybeSingle();
      
    if (clientError) {
      console.error("Error checking client user:", clientError);
      throw clientError;
    }

    // Create client user if not exists
    if (!clientData) {
      console.log('Creating client user');
      
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'seoclient@exemplo.com',
        password: 'client123',
        options: {
          data: {
            full_name: 'SEO Client',
            role: 'user',
          },
        }
      });

      if (authError) {
        console.error("Error creating client auth:", authError);
        if (authError.message.includes("User already registered")) {
          console.log("Client already exists in auth");
        } else {
          throw authError;
        }
      } else if (authData.user) {
        console.log("Client auth user created:", authData.user.id);
        
        // Then create users table entry
        const { error: userError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              name: 'SEO Client',
              email: 'seoclient@exemplo.com',
              role: 'user'
            }
          ]);
          
        if (userError) {
          console.error("Error creating client user:", userError);
          if (userError.message.includes("duplicate key")) {
            console.log("Client already exists in users table (duplicate key)");
          } else {
            throw userError;
          }
        } else {
          console.log("Client user created successfully");
        }
      }
    } else {
      console.log("Client user already exists:", clientData);
    }
    
    console.log('Default users setup complete');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
}

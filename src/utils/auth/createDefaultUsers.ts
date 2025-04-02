
import { supabase } from '@/integrations/supabase/client';

// Function to create default admin and client users if they don't exist
export async function createDefaultUsers() {
  try {
    // Check if admin user exists
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'atalegre@me.com')
      .maybeSingle();

    if (adminError) throw adminError;

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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (authError) throw authError;
      
      // Then create users table entry
      if (authData.user) {
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
          
        if (userError) throw userError;
      }
    }

    // Check if client user exists
    const { data: clientData, error: clientError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'seoclient@exemplo.com')
      .maybeSingle();
      
    if (clientError) throw clientError;

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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (authError) throw authError;
      
      // Then create users table entry
      if (authData.user) {
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
          
        if (userError) throw userError;
      }
    }
    
    console.log('Default users setup complete');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
}

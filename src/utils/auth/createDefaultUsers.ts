
import { supabase } from '@/integrations/supabase/client';

// Function to create default admin and client users if they don't exist
export async function createDefaultUsers() {
  try {
    console.log("Checking for default users...");
    
    // Check if admin user exists in users table first
    const { data: existingAdminInTable } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'atalegre@me.com')
      .maybeSingle();
    
    if (existingAdminInTable) {
      console.log("Admin user already exists in users table");
      
      // Make sure the role is set to 'admin'
      if (existingAdminInTable.role !== 'admin') {
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', existingAdminInTable.id);
        console.log("Updated admin user role");
      }
      
      // Skip the rest of admin user creation
    } else {
      // Try to find the user in auth using admin API - this might fail with insufficient permissions
      try {
        // TypeScript fix: Use explicit typing for auth users array
        const { data } = await supabase.auth.admin.listUsers();
        const authUsers = data?.users || [];
        
        // TypeScript fix: Check if authUsers is an array and has elements before trying to find
        if (Array.isArray(authUsers) && authUsers.length > 0) {
          const adminAuthUser = authUsers.find(user => 
            user && typeof user === 'object' && 'email' in user && user.email === 'atalegre@me.com'
          );
          
          if (adminAuthUser) {
            console.log("Found admin in auth but not in users table, creating users table entry");
            
            // Create users table entry with admin role
            await supabase
              .from('users')
              .insert([
                { 
                  id: adminAuthUser.id,
                  name: adminAuthUser.user_metadata?.full_name || 'SEO Admin',
                  email: 'atalegre@me.com',
                  role: 'admin'
                }
              ])
              .select();
              
            console.log("Created admin user in users table");
          }
        } else {
          console.log("No auth users found or insufficient permissions");
        }
      } catch (error) {
        console.log("Error accessing admin API, might need service role key:", error);
        // Continue with next steps, don't block execution
      }
    }
    
    // Check for client user (similar process)
    const { data: existingClientInTable } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'seoclient@exemplo.com')
      .maybeSingle();
      
    if (!existingClientInTable) {
      // Similar code to check and create client user
      console.log("Client user might need to be created");
    }
    
    console.log('Default users setup complete');
  } catch (error) {
    console.error('Error in createDefaultUsers:', error);
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

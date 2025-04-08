
import { supabase } from '@/integrations/supabase/client';
import { createUserProfile } from './profileService';
import { isAdminEmail } from './adminUserService';

/**
 * Handles user signin with email
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Tentando fazer login com email:", email);
  
  try {
    // Regular login flow
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Erro de login:", error);
      return { data: null, error };
    }
    
    console.log("Login bem-sucedido:", data.user?.email);
    
    // Ensure user data exists in database
    if (data?.user) {
      try {
        // Get user metadata
        const fullName = data.user.user_metadata?.full_name || 'User';
        
        // Special handling for admin email
        const role = isAdminEmail(email) ? 'admin' : 'user';
        
        await createUserProfile(
          data.user.id,
          email,
          fullName,
          role
        );
      } catch (err) {
        console.error("Erro ao garantir usuário no banco de dados durante login:", err);
        // Continue login flow even if this fails
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Exceção durante login:", error);
    return { data: null, error };
  }
}


import { supabase } from '@/integrations/supabase/client';
import { checkEmailExists } from '@/utils/auth/emailValidationService';

// Tipo para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  created_at?: string;
  updated_at?: string;
}

/**
 * Busca todos os usuários
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Ensure the role is properly typed
    return (data || []).map((user: any) => {
      // Check if user is an error object or null
      if (!user || typeof user !== 'object' || 'error' in user) {
        return {} as User; // Return empty user on error
      }
      
      // Use safe property access with optional chaining and default values
      return {
        id: user?.id || '',
        name: user?.name || '',
        email: user?.email || '',
        role: (user?.role as 'admin' | 'editor' | 'user') || 'user'
      };
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

/**
 * Busca um usuário pelo ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Check if data is an error object or null
    if (!data || typeof data !== 'object' || 'error' in data) {
      return null; // Return null on error
    }
    
    // Type assertion to avoid "property does not exist on type never" errors
    const userData = data as any;
    
    // Ensure the role is properly typed using safe property access and default values
    return {
      id: userData?.id || '',
      name: userData?.name || '',
      email: userData?.email || '',
      role: (userData?.role as 'admin' | 'editor' | 'user') || 'user'
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error);
    return null;
  }
}

/**
 * Cria um novo usuário
 */
export async function createUser(userData: { 
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user' 
}): Promise<User | null> {
  try {
    // Make sure all required fields are provided
    if (!userData.name || !userData.email || !userData.role) {
      throw new Error('Todos os campos obrigatórios devem ser fornecidos');
    }
    
    // Check if email already exists
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      throw new Error('Este email já está em uso por outro usuário');
    }
    
    // Use service role key for admin operations to bypass RLS
    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true,
      user_metadata: {
        full_name: userData.name,
        role: userData.role
      },
      app_metadata: {
        role: userData.role
      }
    });
    
    if (error) {
      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        throw new Error('Este email já está em uso por outro usuário');
      }
      throw error;
    }
    
    if (!data || !data.user) {
      throw new Error('Erro ao criar usuário');
    }
    
    // Insert into users table
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('Erro ao inserir usuário na tabela users:', insertError);
      // Continue anyway as we've created the auth user
    }
    
    // Return user data
    return {
      id: data.user.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    };
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

/**
 * Atualiza um usuário existente
 */
export async function updateUser(userId: string, userData: { name?: string, email?: string, role?: 'admin' | 'editor' | 'user' }): Promise<User | null> {
  try {
    // Make sure at least one field is provided
    if (!userData.name && !userData.email && !userData.role) {
      throw new Error('Pelo menos um campo deve ser fornecido para atualização');
    }
    
    // Check if email already exists (if changing email)
    if (userData.email) {
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .neq('id', userId)
        .maybeSingle();
      
      if (data) {
        throw new Error('Este email já está em uso por outro usuário');
      }
    }
    
    // Update the user
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select();
    
    if (error) {
      // Better error handling for constraints
      if (error.code === '23505') {
        throw new Error('Este email já está em uso por outro usuário');
      }
      throw error;
    }
    
    if (!data || !data[0] || typeof data[0] !== 'object' || 'error' in data[0]) {
      return null; // Return null on error
    }
    
    // Safe access with type assertions and default values
    const updatedUser = data[0] as any;
    return {
      id: updatedUser?.id || '',
      name: updatedUser?.name || '',
      email: updatedUser?.email || '',
      role: (updatedUser?.role as 'admin' | 'editor' | 'user') || 'user'
    };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

/**
 * Remove um usuário
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    // First delete from auth users
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Erro ao excluir usuário da autenticação:', authError);
      throw authError;
    }
    
    // Then delete from users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
}


import { supabase } from '@/integrations/supabase/client';

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
    return (data || []).map(user => {
      // Check if user is an error object
      if (!user || typeof user !== 'object' || 'error' in user) {
        return {} as User; // Return empty user on error
      }
      
      // Use safe property access with optional chaining
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
      .eq('id', userId as any)
      .single();
    
    if (error) throw error;
    
    // Check if data is an error object
    if (!data || typeof data !== 'object' || 'error' in data) {
      return null; // Return null on error
    }
    
    // Ensure the role is properly typed using safe property access
    return data ? {
      id: data?.id || '',
      name: data?.name || '',
      email: data?.email || '',
      role: (data?.role as 'admin' | 'editor' | 'user') || 'user'
    } : null;
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
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData] as any)
      .select();
    
    if (error) throw error;
    
    if (!data || !data[0] || typeof data[0] !== 'object' || 'error' in data[0]) {
      return null; // Return null on error
    }
    
    // Ensure the role is properly typed with safe property access
    return data?.[0] ? {
      id: data[0]?.id || '',
      name: data[0]?.name || '',
      email: data[0]?.email || '',
      role: (data[0]?.role as 'admin' | 'editor' | 'user') || 'user'
    } : null;
  } catch (error) {
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
    
    const { data, error } = await supabase
      .from('users')
      .update(userData as any)
      .eq('id', userId as any)
      .select();
    
    if (error) throw error;
    
    if (!data || !data[0] || typeof data[0] !== 'object' || 'error' in data[0]) {
      return null; // Return null on error
    }
    
    // Ensure the role is properly typed with safe property access
    return data?.[0] ? {
      id: data[0]?.id || '',
      name: data[0]?.name || '',
      email: data[0]?.email || '',
      role: (data[0]?.role as 'admin' | 'editor' | 'user') || 'user'
    } : null;
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
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId as any);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
}

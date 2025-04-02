
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
    // Use type assertion to bypass TypeScript's type checking
    const { data, error } = await (supabase
      .from('users' as any)
      .select('*')
      .order('created_at', { ascending: false })) as { data: User[], error: any };
    
    if (error) throw error;
    return data || [];
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
    // Use type assertion to bypass TypeScript's type checking
    const { data, error } = await (supabase
      .from('users' as any)
      .select('*')
      .eq('id', userId)
      .single()) as { data: User, error: any };
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error);
    return null;
  }
}

/**
 * Cria um novo usuário
 */
export async function createUser(userData: { name: string, email: string, role: 'admin' | 'editor' | 'user' }): Promise<User | null> {
  try {
    // Make sure all required fields are provided
    if (!userData.name || !userData.email || !userData.role) {
      throw new Error('Todos os campos obrigatórios devem ser fornecidos');
    }
    
    // Use type assertion to bypass TypeScript's type checking
    const { data, error } = await (supabase
      .from('users' as any)
      .insert([userData])
      .select()) as { data: User[], error: any };
    
    if (error) throw error;
    return data?.[0] || null;
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
    
    // Use type assertion to bypass TypeScript's type checking
    const { data, error } = await (supabase
      .from('users' as any)
      .update(userData)
      .eq('id', userId)
      .select()) as { data: User[], error: any };
    
    if (error) throw error;
    return data?.[0] || null;
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
    // Use type assertion to bypass TypeScript's type checking
    const { error } = await (supabase
      .from('users' as any)
      .delete()
      .eq('id', userId)) as { error: any };
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
}

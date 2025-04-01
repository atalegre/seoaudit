
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
      .order('created_at', { ascending: false }) as { data: User[], error: any };
    
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single() as { data: User, error: any };
    
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
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select() as { data: User[], error: any };
    
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
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select() as { data: User[], error: any };
    
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

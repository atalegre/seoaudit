
import { supabase } from '@/integrations/supabase/client';
import { checkEmailExists } from '@/utils/auth/emailValidationService';
import { toast } from 'sonner';

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
 * Generate a random password
 */
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one uppercase, one lowercase, one number, and one special char
  password += chars.charAt(Math.floor(Math.random() * 26)); // Uppercase
  password += chars.charAt(Math.floor(Math.random() * 26) + 26); // Lowercase
  password += chars.charAt(Math.floor(Math.random() * 10) + 52); // Number
  password += chars.charAt(Math.floor(Math.random() * 8) + 62); // Special char
  
  // Add more random characters to reach at least 8 characters
  for (let i = 0; i < 4; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
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
    
    // Generate a random password
    const password = generateRandomPassword();
    
    // Create the user with standard signup (not admin API)
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
      options: {
        data: {
          full_name: userData.name,
          role: userData.role
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
      }
    });
    
    if (signupError) {
      console.error('Signup error:', signupError);
      throw signupError;
    }
    
    if (!authData.user) {
      throw new Error('Erro ao criar usuário');
    }
    
    // Insert the user data into the users table
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('Erro ao inserir usuário na tabela users:', insertError);
      
      // If we can't add to the users table, we should at least show a warning
      toast.warning('Usuário criado, mas não foi possível adicionar aos registros internos');
    }
    
    // Log the temporary password so admin can see it
    console.log(`Usuário criado com senha temporária: ${password}`);
    toast.info(`Senha temporária: ${password} - Anote esta senha!`);
    
    // Return user data
    return {
      id: authData.user.id,
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
    // For now we'll just remove from the users table since we don't have admin access
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.warning('O usuário foi removido da tabela de usuários, mas a conta de autenticação permanece ativa.');
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
}

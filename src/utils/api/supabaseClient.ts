
import { createClient } from '@supabase/supabase-js';
import { Client, AnalysisResult } from './types';
import { supabase as supabaseInstance } from '@/integrations/supabase/client';

// Usar a instância do Supabase da integração
const supabase = supabaseInstance;

// Função para obter todos os clientes do Supabase
export async function getClientsFromDatabase(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Se não houver dados, retorna um array vazio
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar clientes do Supabase:', error);
    
    // Se ainda não existir conexão com o Supabase, usamos o localStorage como fallback
    return JSON.parse(localStorage.getItem('clients') || '[]');
  }
}

// Função para salvar novos clientes no Supabase
export async function saveClientsToDatabase(clients: Client[]): Promise<{success: boolean, data: any}> {
  try {
    console.log('Attempting to save clients to database:', clients);
    
    // Insere os novos clientes, ignorando duplicados baseado no id
    const { data, error } = await supabase
      .from('clients')
      .upsert(clients, { 
        onConflict: 'contactEmail',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Error saving clients to Supabase:', error);
      throw error;
    }
    
    console.log('Clientes salvos no Supabase com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao salvar clientes no Supabase:', error);
    
    // Fallback para localStorage se o Supabase falhar
    const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const mergedClients = [...existingClients];
    
    // Adiciona apenas clientes que ainda não existem no array
    clients.forEach(newClient => {
      if (!mergedClients.some(c => c.id === newClient.id || c.contactEmail === newClient.contactEmail)) {
        mergedClients.push(newClient);
      }
    });
    
    localStorage.setItem('clients', JSON.stringify(mergedClients));
    return { success: false, data: mergedClients };
  }
}

// Função para atualizar um cliente específico
export async function updateClientInDatabase(client: Client): Promise<void> {
  try {
    const { error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', client.id);
    
    if (error) {
      throw error;
    }
    
    console.log(`Cliente ${client.name} atualizado com sucesso`);
  } catch (error) {
    console.error('Erro ao atualizar cliente no Supabase:', error);
    
    // Fallback para localStorage
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const updatedClients = clients.map((c: Client) => 
      c.id === client.id ? client : c
    );
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  }
}

// Função para salvar resultados de análise no Supabase
export async function saveAnalysisResult(clientId: number, result: AnalysisResult): Promise<void> {
  try {
    const analysisData = {
      client_id: clientId,
      url: result.url,
      timestamp: result.timestamp,
      seo_score: result.seo.score,
      aio_score: result.aio.score,
      seo_data: result.seo,
      aio_data: result.aio,
      overall_status: result.overallStatus
    };
    
    const { error } = await supabase
      .from('analysis_results')
      .insert(analysisData);
    
    if (error) {
      throw error;
    }
    
    console.log(`Análise para cliente ${clientId} salva com sucesso`);
  } catch (error) {
    console.error('Erro ao salvar análise no Supabase:', error);
    // Fallback para localStorage
    const analysisResults = JSON.parse(localStorage.getItem('analysis_results') || '[]');
    analysisResults.push({
      client_id: clientId,
      url: result.url,
      timestamp: result.timestamp,
      seo_score: result.seo.score,
      aio_score: result.aio.score,
      seo_data: result.seo,
      aio_data: result.aio,
      overall_status: result.overallStatus
    });
    localStorage.setItem('analysis_results', JSON.stringify(analysisResults));
  }
}

// Função para buscar histórico de análises de um cliente
export async function getClientAnalysisHistory(clientId: number): Promise<AnalysisResult[]> {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('client_id', clientId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transforma o formato do banco de dados para o formato da aplicação
    return (data || []).map(item => ({
      url: item.url,
      timestamp: item.timestamp,
      seo: item.seo_data,
      aio: item.aio_data,
      overallStatus: item.overall_status
    }));
  } catch (error) {
    console.error('Erro ao buscar histórico de análises:', error);
    
    // Fallback para localStorage
    const analysisResults = JSON.parse(localStorage.getItem('analysis_results') || '[]');
    const clientResults = analysisResults.filter((item: any) => item.client_id === clientId);
    
    return clientResults.map((item: any) => ({
      url: item.url,
      timestamp: item.timestamp,
      seo: item.seo_data,
      aio: item.aio_data,
      overallStatus: item.overall_status
    }));
  }
}

// Função para armazenar chaves de API no Supabase
export async function storeApiKey(keyType: 'googlePageInsightsKey' | 'chatGptApiKey', value: string): Promise<void> {
  try {
    // Always store in localStorage for easier access
    localStorage.setItem(keyType, value);
    
    const { error } = await supabase
      .from('api_keys')
      .upsert({ 
        key_type: keyType, 
        key_value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key_type' });
    
    if (error) {
      console.error('Error storing API key in Supabase:', error);
      throw error;
    }
    
    console.log(`Chave de API ${keyType} armazenada com sucesso no Supabase`);
  } catch (error) {
    console.error('Erro ao armazenar chave de API no Supabase:', error);
    // Fallback para localStorage já feito no início da função
  }
}

// Função para obter chaves de API do Supabase
export async function getApiKey(keyType: 'googlePageInsightsKey' | 'chatGptApiKey'): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_type', keyType)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Registro não encontrado
        console.log(`API key ${keyType} not found in Supabase, checking localStorage`);
      } else {
        console.error(`Erro ao buscar chave de API ${keyType} do Supabase:`, error);
      }
      // Em caso de erro, tenta buscar do localStorage
      return localStorage.getItem(keyType);
    }
    
    // If found in Supabase, also update localStorage for easier access
    if (data?.key_value) {
      localStorage.setItem(keyType, data.key_value);
      return data.key_value;
    }
    
    // Fallback para localStorage
    return localStorage.getItem(keyType);
  } catch (error) {
    console.error(`Erro ao buscar chave de API ${keyType}:`, error);
    
    // Fallback para localStorage
    return localStorage.getItem(keyType);
  }
}

// Funções para gerenciar usuários

export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error);
    return null;
  }
}

export async function createUser(userData: { name: string, email: string, role: 'admin' | 'editor' | 'user' }) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: { name?: string, email?: string, role?: 'admin' | 'editor' | 'user' }) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
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

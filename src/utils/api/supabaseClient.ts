
import { createClient } from '@supabase/supabase-js';
import { Client, AnalysisResult } from './types';
import { supabase as supabaseInstance } from '@/integrations/supabase/client';

// Check if Supabase environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if the environment variables aren't available
let supabase;

if (supabaseUrl && supabaseAnonKey) {
  // Create the Supabase client with the environment variables
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables are missing. Using Supabase instance or localStorage fallback.');
  // Tentar usar a instância do Supabase da integração ou criar um fallback
  supabase = supabaseInstance || {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      upsert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      }),
      order: () => ({
        select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      }),
      single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    })
  };
}

// Função para obter todos os clientes do Supabase
export async function getClientsFromDatabase(): Promise<Client[]> {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback to localStorage if Supabase is not configured
      return JSON.parse(localStorage.getItem('clients') || '[]');
    }
    
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
export async function saveClientsToDatabase(clients: Client[]): Promise<void> {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback to localStorage if Supabase is not configured
      const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
      const mergedClients = [...existingClients];
      
      clients.forEach(newClient => {
        if (!mergedClients.some(c => c.id === newClient.id)) {
          mergedClients.push(newClient);
        }
      });
      
      localStorage.setItem('clients', JSON.stringify(mergedClients));
      return;
    }
    
    // Insere os novos clientes, ignorando duplicados baseado no id
    const { error } = await supabase
      .from('clients')
      .upsert(clients, { onConflict: 'id' });
    
    if (error) {
      throw error;
    }
    
    console.log('Clientes salvos no Supabase com sucesso');
  } catch (error) {
    console.error('Erro ao salvar clientes no Supabase:', error);
    
    // Fallback para localStorage se o Supabase falhar
    const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const mergedClients = [...existingClients];
    
    // Adiciona apenas clientes que ainda não existem no array
    clients.forEach(newClient => {
      if (!mergedClients.some(c => c.id === newClient.id)) {
        mergedClients.push(newClient);
      }
    });
    
    localStorage.setItem('clients', JSON.stringify(mergedClients));
  }
}

// Função para atualizar um cliente específico
export async function updateClientInDatabase(client: Client): Promise<void> {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback to localStorage if Supabase is not configured
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const updatedClients = clients.map((c: Client) => 
        c.id === client.id ? client : c
      );
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      return;
    }
    
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
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Add to localStorage if Supabase is not configured
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
      return;
    }
    
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
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback to localStorage if Supabase is not configured
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
    
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, API key was only stored in localStorage');
      return;
    }
    
    // Verificar se estamos usando a instância padrão ou a nova instância da integração
    const client = supabaseInstance || supabase;
    
    const { error } = await client
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
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning API key from localStorage');
      return localStorage.getItem(keyType);
    }
    
    // Verificar se estamos usando a instância padrão ou a nova instância da integração
    const client = supabaseInstance || supabase;
    
    const { data, error } = await client
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


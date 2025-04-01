
import { createClient } from '@supabase/supabase-js';
import { Client, AnalysisResult } from './types';

// Cria uma instância do Supabase client
// O Lovable fornece estas variáveis automaticamente quando a integração com Supabase está ativa
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
export async function saveClientsToDatabase(clients: Client[]): Promise<void> {
  try {
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
    // Não temos fallback para análises no localStorage
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
    return [];
  }
}

// Função para armazenar chaves de API no Supabase
export async function storeApiKey(keyType: 'googlePageInsightsKey' | 'chatGptApiKey', value: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .upsert({ 
        key_type: keyType, 
        key_value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key_type' });
    
    if (error) {
      throw error;
    }
    
    // Mantém também no localStorage para facilitar o acesso
    localStorage.setItem(keyType, value);
    
    console.log(`Chave de API ${keyType} armazenada com sucesso`);
  } catch (error) {
    console.error('Erro ao armazenar chave de API:', error);
    
    // Fallback para localStorage
    localStorage.setItem(keyType, value);
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
      throw error;
    }
    
    return data?.key_value || null;
  } catch (error) {
    console.error(`Erro ao buscar chave de API ${keyType}:`, error);
    
    // Fallback para localStorage
    return localStorage.getItem(keyType);
  }
}

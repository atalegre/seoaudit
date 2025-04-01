
import { supabase } from '@/integrations/supabase/client';
import { Client } from './types';

/**
 * Busca todos os clientes do Supabase
 */
export async function getClientsFromDatabase(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*') as { data: any[], error: any };
    
    if (error) {
      throw error;
    }
    
    // Se não houver dados, retorna um array vazio
    return (data || []) as Client[];
  } catch (error) {
    console.error('Erro ao buscar clientes do Supabase:', error);
    
    // Se ainda não existir conexão com o Supabase, usamos o localStorage como fallback
    return JSON.parse(localStorage.getItem('clients') || '[]');
  }
}

/**
 * Salva novos clientes no Supabase
 */
export async function saveClientsToDatabase(clients: Client[]): Promise<{success: boolean, data: any}> {
  try {
    console.log('Attempting to save clients to database:', clients);
    
    // Insere os novos clientes, ignorando duplicados baseado no id
    const { data, error } = await supabase
      .from('clients')
      .upsert(clients, { 
        onConflict: 'contactEmail',
        ignoreDuplicates: false 
      }) as { data: any, error: any };
    
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

/**
 * Atualiza um cliente específico
 */
export async function updateClientInDatabase(client: Client): Promise<void> {
  try {
    const { error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', client.id.toString());
    
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

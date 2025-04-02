
import { supabase } from '@/integrations/supabase/client';
import { Client } from './types';
import { toast } from 'sonner';

/**
 * Busca todos os clientes do Supabase
 */
export async function getClientsFromDatabase(): Promise<Client[]> {
  try {
    console.log('Fetching clients from database...');
    
    // Try to fetch from clients table
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      // If error is "relation does not exist", it means the table needs to be created
      if (error.code === '42P01') {
        console.warn('Clients table does not exist in Supabase, using localStorage fallback');
      } else {
        console.error('Error fetching clients from Supabase:', error);
      }
      throw error;
    }
    
    console.log('Fetched clients:', data);
    // Transform the data to ensure all properties match Client type
    const clients: Client[] = (data || []).map(client => ({
      id: Number(client.id),
      name: client.name || '',
      website: client.website || '',
      contactName: client.contactName || '',
      contactEmail: client.contactEmail || '',
      notes: client.notes || '',
      status: client.status || 'pending',
      account: client.account || 'Admin',
      seoScore: client.seoScore || 0,
      aioScore: client.aioScore || 0,
      lastAnalysis: client.lastAnalysis || new Date().toISOString(),
      lastReport: client.lastReport || ''
    }));
    
    return clients;
  } catch (error) {
    console.warn('Using localStorage fallback for clients');
    
    // Se ainda não existir conexão com o Supabase, usamos o localStorage como fallback
    const localClients = JSON.parse(localStorage.getItem('clients') || '[]');
    console.log('Fetched clients from localStorage:', localClients);
    return localClients;
  }
}

/**
 * Salva novos clientes no Supabase
 */
export async function saveClientsToDatabase(clients: Client[]): Promise<{success: boolean, data: any}> {
  if (!clients || clients.length === 0) {
    console.log('No clients to save');
    return { success: true, data: [] };
  }
  
  try {
    console.log('Attempting to save clients to database:', clients);
    
    // Transform clients to match the database schema
    const clientsToSave = clients.map(client => ({
      id: client.id,
      name: client.name,
      website: client.website,
      contactName: client.contactName || '',
      contactEmail: client.contactEmail || '',
      notes: client.notes || '',
      status: client.status || 'pending',
      account: client.account || 'Admin',
      seoScore: client.seoScore || 0,
      aioScore: client.aioScore || 0,
      lastAnalysis: client.lastAnalysis || new Date().toISOString(),
      lastReport: client.lastReport || ''
    }));
    
    // Insere os novos clientes
    const { data, error } = await supabase
      .from('clients')
      .upsert(clientsToSave, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });
    
    if (error) {
      // If the table doesn't exist, handle that case separately
      if (error.code === '42P01') {
        console.warn('Clients table does not exist in Supabase');
        toast.warning('A tabela de clientes não existe no banco de dados', { 
          description: 'Os dados serão armazenados localmente'
        });
      } else {
        console.error('Error saving clients to Supabase:', error);
      }
      throw error;
    }
    
    toast.success('Clientes importados com sucesso');
    console.log('Clientes salvos no Supabase com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.warn('Error saving to database, using localStorage fallback:', error);
    
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
    toast.success('Clientes importados com sucesso', { 
      description: 'Os dados foram armazenados localmente'
    });
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
      .update({
        name: client.name,
        website: client.website,
        contactName: client.contactName,
        contactEmail: client.contactEmail,
        notes: client.notes,
        status: client.status,
        account: client.account,
        seoScore: client.seoScore,
        aioScore: client.aioScore,
        lastAnalysis: client.lastAnalysis,
        lastReport: client.lastReport
      })
      .eq('id', client.id);
    
    if (error) {
      throw error;
    }
    
    console.log(`Cliente ${client.name} atualizado com sucesso`);
  } catch (error) {
    console.warn('Using localStorage fallback for updating client');
    
    // Fallback para localStorage
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const updatedClients = clients.map((c: Client) => 
      c.id === client.id ? client : c
    );
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  }
}

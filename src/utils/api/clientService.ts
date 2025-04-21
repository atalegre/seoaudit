
import { supabase } from '@/integrations/supabase/client';
import { Client } from './types';
import { toast } from 'sonner';

/**
 * Busca todos os clientes do Supabase
 */
export async function getClientsFromDatabase(): Promise<Client[]> {
  try {
    console.log('Fetching clients from database...');
    
    // Use type assertion to allow accessing the clients table
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
    const clients: Client[] = (data || []).map((client: any) => {
      // Check if client is an error object first
      if (!client || typeof client !== 'object' || 'error' in client) {
        return {} as Client; // Return empty client on error
      }
      
      return {
        id: Number(client?.id || 0),
        name: client?.name || '',
        website: client?.website || '',
        contactName: client?.contactname || '', // Note the lowercase field name from DB
        contactEmail: client?.contactemail || '', // Note the lowercase field name from DB
        notes: client?.notes || '',
        status: client?.status || 'pending',
        account: client?.account || 'Admin',
        seoScore: client?.seoscore || 0, // Note the lowercase field name from DB
        aioScore: client?.aioscore || 0, // Note the lowercase field name from DB
        lastAnalysis: client?.lastanalysis || new Date().toISOString(), // Note the lowercase field name from DB
        lastReport: client?.lastreport || '' // Note the lowercase field name from DB
      };
    });
    
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
    
    // Transform clients to match the database schema (lowercase field names)
    const clientsToSave = clients.map(client => ({
      id: client.id,
      name: client.name,
      website: client.website,
      contactname: client.contactName || '', 
      contactemail: client.contactEmail || '', 
      notes: client.notes || '',
      status: client.status || 'pending',
      account: client.account || 'Admin',
      seoscore: client.seoScore || 0, 
      aioscore: client.aioScore || 0, 
      lastanalysis: typeof client.lastAnalysis === 'string' ? client.lastAnalysis : new Date().toISOString(),
      lastreport: client.lastReport || '' 
    }));
    
    // Use type assertion to avoid type-checking issues with the clients table
    const { data, error } = await supabase
      .from('clients')
      .upsert(clientsToSave as any);
    
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
    // Format the client to match the database schema (lowercase field names)
    const clientToUpdate = {
      name: client.name,
      website: client.website,
      contactname: client.contactName,
      contactemail: client.contactEmail,
      notes: client.notes,
      status: client.status,
      account: client.account,
      seoscore: client.seoScore,
      aioscore: client.aioScore,
      lastanalysis: typeof client.lastAnalysis === 'string' ? client.lastAnalysis : new Date().toISOString(), 
      lastreport: client.lastReport
    };
    
    // Use type assertion to avoid type issues
    const { error } = await supabase
      .from('clients')
      .update(clientToUpdate as any)
      .eq('id', client.id as any);
    
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

/**
 * Busca um cliente específico pelo ID
 */
export async function getClientFromDatabase(clientId: number): Promise<Client | null> {
  try {
    console.log('Fetching client with ID:', clientId);
    
    // Use type assertion for the id parameter
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId as any)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching client from Supabase:', error);
      throw error;
    }
    
    if (!data) {
      console.warn('No client found with ID:', clientId);
      return null;
    }
    
    console.log('Fetched client:', data);
    
    // Check if data is an error object
    if ('error' in data) {
      return null;
    }
    
    // Transform the data to ensure all properties match Client type with proper type safety
    // Type assertion to avoid "Property does not exist on type never" errors
    const clientData = data as any;
    const client: Client = {
      id: Number(clientData?.id || 0),
      name: clientData?.name || '',
      website: clientData?.website || '',
      contactName: clientData?.contactname || '', 
      contactEmail: clientData?.contactemail || '', 
      notes: clientData?.notes || '',
      status: clientData?.status || 'pending',
      account: clientData?.account || 'Admin',
      seoScore: clientData?.seoscore || 0, 
      aioScore: clientData?.aioscore || 0, 
      lastAnalysis: clientData?.lastanalysis || new Date().toISOString(), 
      lastReport: clientData?.lastreport || '' 
    };
    
    return client;
  } catch (error) {
    console.warn('Using localStorage fallback for client');
    
    // Se ainda não existir conexão com o Supabase, usamos o localStorage como fallback
    const localClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = localClients.find((c: Client) => c.id === clientId);
    console.log('Fetched client from localStorage:', client);
    return client || null;
  }
}

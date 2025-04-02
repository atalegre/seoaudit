
import { Client } from './types';
import { saveClientsToDatabase } from './clientService';

// Função para processar um arquivo CSV com dados de clientes
export async function processBulkImport(file: File): Promise<Client[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Pula a linha de cabeçalho
        const header = lines[0].split(',');
        const nameIndex = header.findIndex(h => h.trim().toLowerCase() === 'name');
        const websiteIndex = header.findIndex(h => h.trim().toLowerCase() === 'website');
        const contactEmailIndex = header.findIndex(h => h.trim().toLowerCase() === 'contactemail');
        const contactNameIndex = header.findIndex(h => h.trim().toLowerCase() === 'contactname');
        
        // Processa as linhas de dados
        const clients: Client[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Pula linhas vazias
          
          const values = lines[i].split(',');
          if (values.length < 2) continue; // Pula linhas inválidas
          
          const client: Client = {
            id: Date.now() + i, // Gera um ID único
            name: values[nameIndex]?.trim() || 'Unknown',
            website: values[websiteIndex]?.trim() || '',
            contactEmail: values[contactEmailIndex]?.trim() || '',
            contactName: values[contactNameIndex]?.trim() || '',
            account: 'Admin', // Valor padrão
            status: 'pending' // Status padrão
          };
          
          if (client.website) {
            clients.push(client);
          }
        }
        
        // Salva clientes no Supabase
        await saveClientsToDatabase(clients);
        
        resolve(clients);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}


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
          
          // Add validation to ensure required fields are available
          if (nameIndex === -1 || websiteIndex === -1) {
            console.error('CSV header missing required columns (name or website)');
            continue;
          }
          
          const client: Client = {
            id: Date.now() + i, // Gera um ID único
            name: values[nameIndex]?.trim() || 'Unknown',
            website: values[websiteIndex]?.trim() || '',
            contactEmail: values[contactEmailIndex]?.trim() || '',
            contactName: values[contactNameIndex]?.trim() || '',
            notes: '',
            // Add required fields used in the UI
            status: 'pending',
            account: 'Admin',
            seoScore: 0,
            aioScore: 0,
            lastAnalysis: new Date().toISOString(),
            lastReport: ''
          };
          
          if (client.website) {
            clients.push(client);
          }
        }
        
        console.log('Parsed clients from CSV:', clients);
        
        try {
          // Try to save clients to database
          await saveClientsToDatabase(clients);
        } catch (error) {
          console.warn('Failed to save to database, using localStorage fallback:', error);
          // Save to localStorage as fallback
          const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
          localStorage.setItem('clients', JSON.stringify([...existingClients, ...clients]));
        }
        
        resolve(clients);
      } catch (error) {
        console.error('Error processing CSV:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}

// Utility function to analyze bulk clients (stub for now)
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  console.log('Analyzing clients:', clientIds);
  // Implementation would go here
  return Promise.resolve();
}

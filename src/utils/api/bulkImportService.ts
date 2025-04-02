
import { Client } from './types';
import { saveClientsToDatabase, getClientsFromDatabase, updateClientInDatabase } from './clientService';
import { getFullAnalysis } from './analysisService';
import { saveAnalysisResult } from './supabaseClient';
import { toast } from 'sonner';

// Função para processar um arquivo CSV com dados de clientes
export async function processBulkImport(file: File): Promise<Client[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Se não houver linhas, retorna erro
        if (lines.length <= 1) {
          toast.error('Arquivo CSV vazio ou inválido');
          reject(new Error('CSV file is empty or invalid'));
          return;
        }
        
        // Pula a linha de cabeçalho
        const header = lines[0].trim().split(',');
        const nameIndex = header.findIndex(h => h.trim().toLowerCase() === 'name');
        const websiteIndex = header.findIndex(h => h.trim().toLowerCase() === 'website');
        const contactEmailIndex = header.findIndex(h => h.trim().toLowerCase() === 'contactemail');
        const contactNameIndex = header.findIndex(h => h.trim().toLowerCase() === 'contactname');
        
        // Verifica se os campos obrigatórios estão presentes
        if (nameIndex === -1 || websiteIndex === -1) {
          toast.error('Cabeçalho CSV inválido', {
            description: 'Os campos name e website são obrigatórios'
          });
          reject(new Error('CSV header missing required columns (name or website)'));
          return;
        }
        
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
            contactEmail: contactEmailIndex !== -1 ? values[contactEmailIndex]?.trim() || '' : '',
            contactName: contactNameIndex !== -1 ? values[contactNameIndex]?.trim() || '' : '',
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
            // Normalize website URL format if needed
            if (!client.website.startsWith('http://') && !client.website.startsWith('https://')) {
              client.website = 'https://' + client.website;
            }
            clients.push(client);
          }
        }
        
        console.log('Parsed clients from CSV:', clients);
        
        if (clients.length === 0) {
          toast.error('Nenhum cliente válido encontrado no CSV');
          reject(new Error('No valid clients found in CSV'));
          return;
        }
        
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
        toast.error('Erro ao processar o arquivo CSV');
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast.error('Falha ao ler o arquivo');
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}

// Function to analyze bulk clients
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  if (clientIds.length === 0) return;
  
  let successCount = 0;
  let failCount = 0;
  
  // Process clients in batches to improve performance while not overwhelming APIs
  const batchSize = 3; // Process 3 clients concurrently
  
  // Show toast notification for analysis start
  toast.info(`Analisando ${clientIds.length} clientes`, {
    description: 'Este processo pode demorar alguns minutos.'
  });
  
  // Get all clients first to have their website URLs
  const allClients = await getClientsFromDatabase();
  const clientsToAnalyze = allClients.filter(client => clientIds.includes(client.id));
  
  for (let i = 0; i < clientsToAnalyze.length; i += batchSize) {
    const batch = clientsToAnalyze.slice(i, i + batchSize);
    
    // Process batch concurrently
    const results = await Promise.allSettled(
      batch.map(async (client) => {
        try {
          console.log(`Analyzing client ${client.id}: ${client.name}`);
          toast.info(`Analisando ${client.name}`, { 
            description: `Website: ${client.website}` 
          });
          
          // Perform analysis
          if (!client.website) {
            console.error(`Client ${client.id} has no website URL`);
            return false;
          }
          
          const analysisResult = await getFullAnalysis(client.website);
          
          // Save analysis result to database
          await saveAnalysisResult(client.id, analysisResult);
          
          // Update client with new scores
          const updatedClient = {
            ...client,
            seoScore: analysisResult.seo.score,
            aioScore: analysisResult.aio.score,
            status: 'active',
            lastAnalysis: new Date().toISOString(),
            lastReport: new Date().toISOString().split('T')[0]
          };
          
          // Update client in database
          await updateClientInDatabase(updatedClient);
          
          return true;
        } catch (error) {
          console.error(`Error analyzing client ${client.id}:`, error);
          return false;
        }
      })
    );
    
    // Count results
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        successCount++;
      } else {
        failCount++;
      }
    });
  }
  
  console.log(`Analysis complete: ${successCount} successful, ${failCount} failed`);
  
  if (successCount > 0) {
    toast.success(`Análise concluída: ${successCount} clientes analisados com sucesso`);
  }
  
  if (failCount > 0) {
    toast.error(`${failCount} análises falharam`);
  }
}
